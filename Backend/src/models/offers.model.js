import mongoose from "mongoose";

const offersSchema = new mongoose.Schema({
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "game",
        required: [true, "Game is required"]
    },
    role: {
        type: String,
        enum: ["user", "seller"],
        required: [true, "Role is required"]
    },
    offerPrice: {
        type: Number,
        required: [true, "Offer price is required"]
    },
    message: {
        type: String,
        required: [true, "Message is required"]
    }
}, { timestamps: true });

export const offersModel = mongoose.model("offers", offersSchema);