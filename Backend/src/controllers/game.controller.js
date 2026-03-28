import { gameModel } from "../models/game.model.js";
import { offersModel } from "../models/offers.model.js";
import { userModel } from "../models/user.model.js";
import { generateNegotiationResponse, getScore } from "../services/ai.service.js";
import { leaderboardModel } from "../models/leaderboard.model.js";

/**
 * @description Start Game Controller
 * @route POST /api/game/start
 */

export async function startGame(req, res) {
    const { productName, difficulty } = req.body;
    if (!productName) {
        return res.status(400).json({
            message: "Product name is required",
            success: false
        })
    }
    const startingPrice = Math.floor(Math.random() * (10000 - 2000 + 1)) + 2000;
    const targetPrice = Math.floor(startingPrice * 0.7);
    const minPrice = Math.floor(startingPrice * 0.5);

    const game = await gameModel.create({
        user: req.user.id,
        product: productName,
        startingPrice,
        targetPrice,
        minPrice,
        difficulty: difficulty || "medium"
    });

    res.status(201).json({
        message: "Game session created successfully",
        success: true,
        game
    });
}

/**
 * @description Make Offer Controller
 * @route POST /api/game/offer
 */

export async function makeOffer(req, res) {
    const { gameId, offerPrice, message } = req.body;
    if (!offerPrice) return res.status(400).json({ message: "Offer price is required", success: false });
    if (!gameId) return res.status(400).json({ message: "Game ID is required", success: false });

    const game = await gameModel.findById(gameId);
    if (!game) return res.status(404).json({ message: "Active game not found", success: false });

    const userOffer = await offersModel.create({
        game: game._id,
        role: "user",
        offerPrice,
        message
    });

    const history = await offersModel.find({ game: game._id }).sort({ createdAt: 1 });

    const aiResponse = await generateNegotiationResponse(game, history, message);

    const aiOffer = await offersModel.create({
        game: game._id,
        role: "seller",
        offerPrice: aiResponse.counterPrice,
        message: aiResponse.message
    });

    res.status(201).json({
        message: "Offer handled successfully",
        success: true,
        aiOffer,
        decision: aiResponse.decision
    });
}


/**
 * @description End Game Controller
 * @route POST /api/game/end
 */

export async function endGame(req, res) {
    try {
        const { gameId, finalPrice } = req.body;
        if (!gameId) return res.status(400).json({ message: "Game ID is required", success: false });

        const game = await gameModel.findById(gameId);
        if (!game) return res.status(404).json({ message: "Active game not found", success: false });

        let score = 0;
        let resultFinalPrice = finalPrice;

        if (finalPrice !== 0) {
            const scoreData = await getScore(game, finalPrice || game.targetPrice);
            score = scoreData.score;
            resultFinalPrice = scoreData.finalPrice || finalPrice || game.targetPrice;

            let username = req.user.username;
            if (!username) {
                const user = await userModel.findById(req.user.id);
                if (user) username = user.username;
            }

            await leaderboardModel.findOneAndUpdate(
                { user: req.user.id },
                {
                    $max: { score: score },
                    $set: { username: username || "Anonymous" }
                },
                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
            );

            await userModel.findByIdAndUpdate(req.user.id, { score: score });
        }

        game.finalPrice = resultFinalPrice;
        await game.save();

        res.status(200).json({
            message: finalPrice === 0 ? "Game abandoned" : "Game ended",
            success: true,
            score: score,
            finalPrice: game.finalPrice
        });
    } catch (error) {
        console.error("EndGame error:", error);
        res.status(500).json({
            message: "Failed to terminate game session",
            success: false,
            error: error.message
        });
    }
}

/**
 * @description Get Suggestion Controller
 * @route POST /api/game/suggestion
 */

export async function getSuggestion(req, res) {
    const { gameId } = req.body;
    const game = await gameModel.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found", success: false });

    const latestOffer = await offersModel.findOne({ game: gameId, role: "seller" }).sort({ createdAt: -1 });
    const currentPrice = latestOffer ? latestOffer.offerPrice : game.startingPrice;

    const suggestion = `Try focusing on the market value and suggest a price around ₹${Math.round((currentPrice + game.targetPrice) / 2)}.`;

    res.status(200).json({
        message: "Suggestion fetched",
        success: true,
        suggestion
    });
}
