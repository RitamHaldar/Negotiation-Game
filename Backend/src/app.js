import express from "express";
import cookieParser from "cookie-parser";
import authroute from "./routes/auth.routes.js"
import gameroute from "./routes/game.routes.js"
import leaderboardroute from "./routes/leaderboard.routes.js"
import cors from "cors"

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json());
app.use(cors({
    origin: "https://negotiation-game.onrender.com",
    credentials: true
}))

/**
 * @description Routes
 */
app.use("/api/auth", authroute);
app.use("/api/game", gameroute);
app.use("/api/leaderboard", leaderboardroute);
export default app;