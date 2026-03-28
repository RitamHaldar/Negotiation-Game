import express from "express"
import { Identifyuser } from "../middlewares/auth.middleware.js"
import {
    getLeaderboard,
    updateLeaderboard,
    getUserStats
} from "../controllers/leaderboard.controller.js"

const leaderboardroute = express.Router()

/**
 * @description Get Leaderboard
 * @route GET /api/leaderboard
 * @access Private
 */
leaderboardroute.get("/", Identifyuser, getLeaderboard)

/**
 * @description Update Leaderboard
 * @route POST /api/leaderboard/update
 * @access Private
 */
leaderboardroute.post("/update", Identifyuser, updateLeaderboard)

/**
 * @description Get User Stats
 * @route GET /api/leaderboard/user-stats
 * @access Private
 */
leaderboardroute.get("/user-stats", Identifyuser, getUserStats)

export default leaderboardroute