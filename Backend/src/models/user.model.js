import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username must be unique"],
        required: [true, "Username is required "]
    },
    email: {
        type: String,
        unique: [true, "Emails must be unique"],
        required: [true, "Email is required "]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false
    },
    score: {
        type: Number,
        default: 0
    }
}, { timestamps: true })
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
})
userSchema.methods.comparePassword = function (Enteredpassword) {
    return bcrypt.compare(Enteredpassword, this.password);
}

export const userModel = mongoose.model("user", userSchema)