const redis_client = require("../redis.config");

exports.getPeticijas = async (req, res, next) => {
    if (req.query.user_name || req.query.user_surname) {
        return next();
    }
    const redis_res = await redis_client.get(
        "peticija_tag_name:" + req.query.tag
    );

    if (redis_res?.length > 0) {
        console.log("redis peticija");
        return res.status(200).send(JSON.parse(redis_res));
    }

    const redis_all_peticijas = await redis_client.get("all_peticijas");
    if (redis_all_peticijas?.length > 0) {
        return res.status(200).send(JSON.parse(redis_all_peticijas));
    }

    next();
};

exports.savePeticijas = async (peticija_list, tag, user_name, user_surname) => {
    if (user_name && user_surname) {
        return;
    }
    if (tag) {
        await redis_client.setEx(
            "peticija_tag_name:" + tag,
            3600,
            JSON.stringify(peticija_list)
        );
    } else {
        await redis_client.setEx(
            "all_peticijas",
            3600,
            JSON.stringify(peticija_list)
        );
    }
};

exports.getSinglePeticija = async (req, res, next) => {
    const redis_res = await redis_client.get(
        "single_peticija:" + req.params.naslov
    );

    if (redis_res) {
        return res.status(200).send(JSON.parse(redis_res));
    }

    next();
};

exports.saveSinglePeticija = async peticija => {
    await redis_client.setEx(
        "single_peticija:" + peticija.naslov,
        3600,
        JSON.stringify(peticija)
    );
};
