const neo4j_client = require("../neo4j.config.js");
const Blog = require("../Models/Blog");
const User = require("../Models/User");
const Tag = require("../Models/Tag");
const helpers = require("./helpers");
const RedisBlogs = require("./RedisBlog");
const redis_client = require("../redis.config.js");

exports.getSingleBlog = async (req, res) => {
    if (!req.params.naslov || req.params.naslov === "") {
        return res.status(406).json({ message: "Morate uneti naslov" });
    }

    let session = neo4j_client.session();
    try {
        const tags = await session
            .run(
                `MATCH ((t:Tag)--(:Blog {naslov:$naslov})) RETURN (t) as tags`,
                {
                    naslov: req.params.naslov
                }
            )
            .then(result => {
                return result.records.map(r => {
                    const tag = new Tag("");
                    tag.makeTag(r.get("tags"));
                    return tag.naziv;
                });
            });

        //START s=NODE(517) MATCH(s) RETURN s
        const blogs = await session
            .run(
                `MATCH ((n:Blog {naslov:$naslov})<-[:WRITTEN]-(u:User)) RETURN (n) AS Blog, (u) as user`,
                // "MATCH (n) WHERE elementId(n) = $naslov RETURN n AS Blog",
                {
                    naslov: req.params.naslov
                }
            )
            .then(result => {
                return result.records.map(r => {
                    const b = new Blog();
                    b.makeBlog(r.get("Blog"));
                    const user = new User();
                    user.makeUser(r.get("user"));
                    b.vlasnik = user.toShort();
                    b.tag = tags;
                    return b;
                });
            });

        session.close();
        if (blogs.length !== 1) {
            return res.status(404).json({ message: "Blog not found" });
        }

        RedisBlogs.saveSingleBlog(blogs[0]);

        return res.status(200).json(blogs[0]);
    } catch (err) {
        session.close();

        return res.status(500).json(err);
    }
};

exports.findBlogs = async (req, res) => {
    const filter = req.query.filter
        ? ".*" + req.query.tag.toLowerCase() + ".*"
        : ".*";

    let session = neo4j_client.session();
    try {
        const p_res = await session
            .run(
                `MATCH (t:Tag WHERE toLower(t.naziv) =~ $nazivTaga)-[:TAGGED]->(n:Blog)
                <-[:WRITTEN]-(u:User WHERE toLower(u.name) =~ $userName AND toLower(u.surname) =~ $userSurname) 
                RETURN (n) AS Blog, (t) AS Tag, (u) AS User`,
                {
                    nazivTaga: filter,
                    userName: filter,
                    userSurname: filter
                }
            )
            .then(result => {
                let pomB = new Blog();

                return result.records.map(r => {
                    const p = new Blog();
                    p.makeBlog(r.get("Blog"));
                    const t = new Tag();
                    t.makeTag(r.get("Tag"));
                    const u = new User();
                    u.makeUser(r.get("User"));

                    if (pomB.naslov === p.naslov) {
                        pomB.tag.push(t.naziv);
                    } else {
                        pomB = p;
                        pomB.tag.push(t.naziv);
                        pomB.vlasnik = u.toShort();
                    }
                    return pomB;
                });
            });

        const blog_list = [...new Set(p_res)];

        console.log({ blog_list });

        for (let i = 0; i < blog_list.length; i++) {
            const blog = blog_list[i];
            const tags = new Set(blog.tag);
            await session
                .run(
                    `MATCH ((t:Tag)--(:Blog {naslov:$naslov})) RETURN (t) as tags`,
                    {
                        naslov: blog.naslov
                    }
                )
                .then(result => {
                    result.records.forEach(r => {
                        const tag = new Tag("");
                        tag.makeTag(r.get("tags"));
                        tags.add(tag.naziv);
                    });
                });

            blog.tag = [...tags];
        }

        session.close();

        RedisBlogs.saveBlogs(
            blog_list,
            req.query.filter,
            req.query.user_name,
            req.query.user_surname
        );

        return res.status(200).json(blog_list);
    } catch (err) {
        session.close();
        return res.status(500).json(err);
    }
};

exports.addBlog = async (req, res) => {
    const { naslov, text, tag, user_email } = req.body;

    if (!req.file) {
        return res.status(406).json({ message: "Morate uneti sliku" });
    }

    if (!naslov || naslov.length < 5) {
        return res.status(406).json({ message: "Naslov mora biti duzi od 5" });
    }
    if (!text || text.length < 15) {
        return res.status(406).json({ message: "text mora biti duzi od 15" });
    }
    if (!tag || tag === "") {
        return res.status(406).json({ message: "Morate uneti bar jedan tag" });
    }
    if (!user_email) {
        return res.status(406).json({ message: "Nemas mail od usera" });
    }

    const image = await helpers.makeImage(req.file, "Blog " + naslov);

    if (image === false) {
        return res.status(500).json({ message: "Doslo je do greske" });
    }

    let session = neo4j_client.session();
    try {
        const blog = new Blog();
        blog.naslov = naslov;
        blog.text = text;
        blog.tag = tag.split(",");

        const blog_exsts = await session.run(
            `MATCH (n:Blog {naslov: $naslov }) RETURN n.naslov`,
            {
                naslov: blog.naslov
            }
        );

        if (blog_exsts.records.length !== 0) {
            return res.status(406).json({ message: "Blog already exists" });
        }

        const user_exsts = await session.run(
            "MATCH (n:User {email: $email}) RETURN n AS User",
            {
                email: user_email
            }
        );

        if (user_exsts.records.length === 0) {
            return res.status(404).json({ message: "User doesn't exists" });
        }

        const tag_res = await session.run(
            "MATCH (n:Tag) where n.naziv IN $naziv RETURN coalesce(n.naziv) as naziv, elementId(n) as id",
            {
                naziv: blog.tag
            }
        );

        const tag_list = tag_res.records.map(record => record.get("naziv"));
        const newTags = blog.tag.filter(el => !tag_list.includes(el));

        if (newTags.length !== 0) {
            for (let i = 0; i < newTags.length; i++) {
                await session.run(
                    "CREATE (n:Tag {naziv: $nazivTaga}) RETURN n",
                    {
                        nazivTaga: newTags[i]
                    }
                );
            }
        }

        await session.run(
            "CREATE (n:Blog {naslov: $naslov , text: $text, slika: $slika }) RETURN n.naslov",
            {
                naslov: blog.naslov,
                text: blog.text,
                slika: image
            }
        );

        await session.run(
            `MATCH (b:Blog), (u:User) 
            WHERE b.naslov = $naslovBloga AND u.email = $user_email
            CREATE (u)-[:WRITTEN]->(b) RETURN b,u`,
            {
                naslovBloga: blog.naslov,
                user_email: user_email
            }
        );

        for (let i = 0; i < blog.tag.length; i++) {
            await session.run(
                `MATCH (b:Blog), (t:Tag) 
                WHERE b.naslov = $naslovBloga AND t.naziv = $nazivTaga
                CREATE (t)-[tag:TAGGED]->(b) RETURN t,b`,
                {
                    nazivTaga: blog.tag[i],
                    naslovBloga: blog.naslov
                }
            );
        }

        redis_client.publish(
            "tag:user",
            JSON.stringify({
                tag: blog.tag,
                naslov: blog.naslov,
                message: "Novi blog"
            })
        );

        session.close();
        return res.status(200).json({ message: "success" });
    } catch (err) {
        session.close();
        return res.status(500).json(err);
    }
};

exports.deleteBlog = async (req, res) => {
    if (!req.params.naslov || req.params.naslov === "") {
        return res.status(406).json({ message: "Morate uneti naslov" });
    }
    const session = neo4j_client.session();
    try {
        await session.run(`MATCH (n:Blog {naslov: $naslov }) DETACH DELETE n`, {
            naslov: req.params.naslov
        });
        session.close();
        return res.status(200).json({ message: "Ide gas" });
    } catch (err) {
        session.close();

        return res.status(500).json({ err });
    }
};
