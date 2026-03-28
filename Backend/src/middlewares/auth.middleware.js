import jwt from "jsonwebtoken"
import { redis } from "../config/cache.js"

export async function Identifyuser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Token not present",
            success: false,
            err: "Token not available"
        })
    }
    const blacklistedtoken = await redis.get(token);
    if (blacklistedtoken) {
        return res.status(401).json({
            message: "Token is blacklisted",
            success: false,
            err: "Token cannot be authorized"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({
            message: "Token not verified",
            success: false,
            err: "Token cannot be authorized"
        })
    }
}