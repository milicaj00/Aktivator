const redis_client = require("../../redis.config");

exports.getPeticijas = async (req, res, next) => {
    if (!req.query.filter) {
        const redis_all_peticijas = await redis_client.get("all_peticijas");
        if (redis_all_peticijas?.length > 0) {
            return res.status(200).send(JSON.parse(redis_all_peticijas));
        }
    } else {
        const redis_res = await redis_client.get(
            "peticija_filter:" + req.query.filter
        );

        if (redis_res?.length > 0) {
          
            return res.status(200).send(JSON.parse(redis_res));
        }
    }
    next();
};

exports.savePeticijas = async (peticija_list, filter) => {
    if (filter) {
        await redis_client.setEx(
            "peticija_filter:" + filter,
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
    //  console.log("save peticija");
    await redis_client.setEx(
        "single_peticija:" + peticija.naslov,
        3600,
        JSON.stringify(peticija)
    );
};

exports.deleteSinglePeticija = async naslov => {
    const pre = await redis_client.get("single_peticija:" + naslov);
    console.log({ pre });
    await redis_client.del("single_peticija:" + naslov);

    const posle = await redis_client.get("single_peticija:" + naslov);
    console.log({ posle });
};

exports.deleteAllPeticijas = async () => {
    const pre = await redis_client.get("all_peticijas");
    console.log({ pre });
    const keys = await redis_client.keys("peticija_filter*");
    console.log({ keys });

    keys.forEach(async k => {
        await redis_client.del(k);
    });

    await redis_client.del("all_peticijas");

    const posle = await redis_client.get("all_peticijas");
    console.log({ posle });
};
