const redis_client = require("../redis.config");

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
