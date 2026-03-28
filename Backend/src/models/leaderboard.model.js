import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User is required"],
        unique: true
    },
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    score: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const leaderboardModel = mongoose.model("leaderboard", leaderboardSchema);
