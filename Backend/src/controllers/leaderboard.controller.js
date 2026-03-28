import { leaderboardModel } from "../models/leaderboard.model.js";

export async function getLeaderboard(req, res) {
    const leaderboard = await leaderboardModel.find().sort({ score: -1 }).limit(10);
    res.status(200).json({
        message: "Leaderboard fetched successfully",
        success: true,
        leaderboard
    });
}

export async function updateLeaderboard(req, res) {
    const { score } = req.body;
    const leaderboard = await leaderboardModel.create({
        user: req.user.id,
        username: req.user.username,
        score
    });
    res.status(201).json({
        message: "Leaderboard updated successfully",
        success: true,
        leaderboard
    });
}
export async function getUserStats(req, res) {
    try {
        const userBest = await leaderboardModel.findOne({ user: req.user.id });
        let rank = "N/A";
        let score = 0;

        if (userBest) {
            score = userBest.score;
            const higherScoresCount = await leaderboardModel.countDocuments({ score: { $gt: score } });
            rank = higherScoresCount + 1;
        }

        res.status(200).json({
            message: "User stats fetched successfully",
            success: true,
            userStats: { rank, score }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}