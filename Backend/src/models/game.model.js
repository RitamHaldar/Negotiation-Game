import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User is required"]
    },
    product: {
        type: String,
        required: [true, "product is required"]
    },
    startingPrice: {
        type: Number,
        required: [true, "starting price is required"]
    },
    targetPrice: {
        type: Number,
        required: [true, "target price is required"]
    },
    minPrice: {
        type: Number,
        required: [true, "minimum price is required"]
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium"
    },
    completedTime: {
        type: Number,
        default: null
    },
    finalPrice: {
        type: Number,
        default: null
    }
}, { timestamps: true });

export const gameModel = mongoose.model("game", gameSchema);
