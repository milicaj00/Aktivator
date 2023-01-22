const redis_client = require("../redis.config");

exports.getBlogs = async (req, res, next) => {
    const redis_res = await redis_client.get("tag_name:" + req.query.tag);

    if (redis_res?.length > 0) {
        return res.status(200).send(JSON.parse(redis_res));
    }
    if (!req.query.user_name && !req.query.user_surname && !req.query.tag) {
        const redis_all_blogs = await redis_client.get("all_blogs");
        if (redis_all_blogs?.length > 0) {
            return res.status(200).send(JSON.parse(redis_all_blogs));
        }
    }

    next();
};

exports.saveBlogs = async (blog_list, tag, user_name, user_surname) => {
    if (tag) {
        await redis_client.setEx(
            "tag_name:" + tag,
            3600,
            JSON.stringify(blog_list)
        );
    } else if (!user_name && !user_surname) {
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
