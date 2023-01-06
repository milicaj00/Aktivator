const neo4j_client = require("../neo4j.config.js");
const Blog = require("../Models/Blog");
const User = require("../Models/User");
const Tag = require("../Models/Tag");

exports.getAllBlogs = async (req, res) => {
    let session = neo4j_client.session();
    try {
        const p_res = await session
            .run(
                `MATCH (t:Tag)-[:TAGGED]->(n:Blog)<-[:WRITTEN]-(u:User) RETURN (n) AS Blog, (t) AS Tag, (u) AS User`
            )
            .then(result => {
                let pomB = new Blog();
                console.log(result.records);

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
        session.close();
        return res.status(200).json(blog_list);
    } catch (err) {
        session.close();
        return res.status(500).json(err);
    }
};

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
                    const p = new Blog();
                    p.makeBlog(r.get("Blog"));
                    const user = new User();
                    user.makeUser(r.get("user"));
                    p.vlasnik = user.toShort();
                    p.tag = tags;
                    return p;
                });
            });

        session.close();
        if (blogs.length !== 1) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json(blogs[0]);
    } catch (err) {
        session.close();

        return res.status(500).json(err);
    }
};

exports.findBlogs = async (req, res) => {
    const tag_filter = req.params.tag;
    const user_name_filter = req.query.user_name
        ? ".*" + req.query.user_name.toLowerCase() + ".*"
        : ".*";
    const user_surname_filter = req.query.user_surname
        ? ".*" + req.query.user_surname.toLowerCase() + ".*"
        : ".*";

    let session = neo4j_client.session();
    try {
        const p_res = await session
            .run(
                `MATCH (t:Tag {naziv:$nazivTaga})-[:TAGGED]->(n:Blog)
                <-[:WRITTEN]-(u:User WHERE toLower(u.name) =~ $userName AND toLower(u.surname) =~ $userSurname) 
                RETURN (n) AS Blog, (t) AS Tag, (u) AS User`,
                {
                    nazivTaga: tag_filter,
                    userName: user_name_filter,
                    userSurname: user_surname_filter
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
        session.close();
        return res.status(200).json(blog_list);
    } catch (err) {
        session.close();
        return res.status(500).json(err);
    }
};

exports.addBlog = async (req, res) => {
    const { naslov, text, tag, user_mail } = req.body;

    if (!naslov || naslov.length < 5) {
        return res.status(406).json({ message: "Naslov mora biti duzi od 5" });
    }
    if (!text || text.length < 15) {
        return res.status(406).json({ message: "text mora biti duzi od 15" });
    }
    if (!tag || tag === "") {
        return res.status(406).json({ message: "Morate uneti bar jedan tag" });
    }
    if (!user_mail) {
        return res.status(406).json({ message: "Nemas mail od usera" });
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
            "MERGE (n:Blog {naslov: $naslov , text: $text }) RETURN n.naslov",
            {
                naslov: blog.naslov,
                text: blog.text
            }
        );

        await session.run(
            `MATCH (b:Blog), (u:User) 
            WHERE b.naslov = $naslovBloga AND u.email = $user_mail
            CREATE (u)-[write:WRITTEN]->(b) RETURN b,u`,
            {
                naslovBloga: blog.naslov,
                user_mail: user_mail
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