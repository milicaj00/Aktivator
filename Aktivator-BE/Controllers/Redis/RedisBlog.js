const redis_client = require("../../redis.config");

exports.getBlogs = async (req, res, next) => {
    const redis_res = await redis_client.get("blog_filter:" + req.query.filter);

    if (redis_res?.length > 0) {
        console.log("redis blog");
        return res.status(200).send(JSON.parse(redis_res));
    }

    const redis_all_blogs = await redis_client.get("all_blogs");
    if (redis_all_blogs?.length > 0) {
        // console.log({redis_all_blogs})
        return res.status(200).send(JSON.parse(redis_all_blogs));
    }

    next();
};

exports.saveBlogs = async (blog_list, filter) => {
    if (filter) {
        await redis_client.setEx(
            "blog_filter:" + filter,
            3600,
            JSON.stringify(blog_list)
        );
    } else {
        await redis_client.setEx("all_blogs", 3600, JSON.stringify(blog_list));
    }
};

exports.getSingleBlog = async (req, res, next) => {
    const redis_res = await redis_client.get(
        "single_blog:" + req.params.naslov
    );

    if (redis_res) {
        return res.status(200).send(JSON.parse(redis_res));
    }

    next();
};

exports.saveSingleBlog = async blog => {
    await redis_client.setEx(
        "single_blog:" + blog.naslov,
        3600,
        JSON.stringify(blog)
    );
};

exports.deleteSingleBlog = async naslov => {
    const pre = await redis_client.get("single_blog:" + naslov);
    console.log({ pre });
    await redis_client.del("single_blog:" + naslov, (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }
        console.log(result);
        callback(null, result);
    });

    const posle = await redis_client.get("single_blog:" + naslov);
    console.log({ posle });
};

exports.deleteAllBlogs = async () => {
    const pre = await redis_client.get("all_blogs");
    console.log({ pre });
    const keys = await redis_client.keys("blog_filter*");
    console.log({ keys });

    keys.forEach(async k => {
        await redis_client.del(k);
    });

    await redis_client.del("all_blogs");

    const posle = await redis_client.get("all_blogs");
    console.log({ posle });
};

exports.deleteFilterBlogs = async filter => {
    const pre = await redis_client.get("blog_filter:" + filter);
    console.log({ pre });
    await redis_client.del("blog_filter:" + filter, (err, result) => {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        }
        console.log(result);
        callback(null, result);
    });

    const posle = await redis_client.get("blog_filter:" + filter);
    console.log({ posle });
};
