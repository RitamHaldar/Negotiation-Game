import express from "express"
import { Identifyuser } from "../middlewares/auth.middleware.js"
import {
    startGame,
    makeOffer,
    endGame,
    getSuggestion
} from "../controllers/game.controller.js"

const gameroute = express.Router()

/**
 * @description Start Game
 * @route POST /api/game/start
 * @access Private
 */
gameroute.post("/start", Identifyuser, startGame)

/**
 * @description Make Offer
 * @route POST /api/game/offer
 * @access Private
 */
gameroute.post("/offer", Identifyuser, makeOffer)

/**
 * @description End Game
 * @route POST /api/game/end
 * @access Private
 */
gameroute.post("/end", Identifyuser, endGame)

/**
 * @description Game Suggestion
 * @route POST /api/game/suggestion
 * @access Private
 */
gameroute.post("/suggestion", Identifyuser, getSuggestion)

export default gameroute