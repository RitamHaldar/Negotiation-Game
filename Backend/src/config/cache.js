import Redis from "ioredis";

export const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,

})
redis.on("connect", () => {
    console.log("Connected to redis");
})
redis.on("error", (err) => {
    console.log(err);
})