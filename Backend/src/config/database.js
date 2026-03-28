import mongoose from "mongoose";
export function Connecttodb() {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("connected to db")
    })
}