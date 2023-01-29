const redis_client = require("../../redis.config");

exports.getUser = async (req, res, next) => {
    const redis_res = await redis_client.get("user:" + req.params.id);

    if (redis_res) {
        return res.status(200).send(JSON.parse(redis_res));
    }
    next();
};

exports.saveUser = async user => {
    await redis_client.setEx("user:" + user.id, 3600, JSON.stringify(user));
};

exports.deleteUser = async id => {
    await redis_client.del("user:" + id);
};
