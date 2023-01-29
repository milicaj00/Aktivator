const redis = require("redis");
const redis_client = redis.createClient(process.env.REDIS_PORT);

(async () => {
    redis_client.on("ready", () => console.log("Redis is ready."));
    redis_client.on("error", err => console.log("Redis Client Error", err));
    await redis_client.connect();
})();

module.exports = redis_client;
