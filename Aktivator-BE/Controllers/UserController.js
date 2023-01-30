const neo4j_client = require("../neo4j.config.js");
const RedisUser = require("./Redis/RedisUser");
const crypto = require("crypto");
const User = require("../Models/User");
const Tag = require("../Models/Tag");
const Peticija = require("../Models/Peticija");
const Blog = require("../Models/Blog");

exports.addUser = async (req, res) => {
    const { email, name, surname, password } = req.body;
    const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!email || !email.match(emailFormat)) {
        return res.status(406).json({ message: "nevalidan mail" });
    }
    if (!name || name === "" || name === " ") {
        return res.status(406).json({ message: "Morate uneti ime" });
    }
    if (!surname || surname === "" || surname === " ") {
        return res.status(406).json({ message: "Morate uneti prezime" });
    }
    if (!password || password.length < 4) {
        return res
            .status(406)
            .json({ message: "Lozinka mora da bude duza od 6" });
    }

    try {
        let session = neo4j_client.session();

        const user = new User();
        user.email = email;
        user.name = name;
        user.surname = surname;
        user.password = password ? password : "";

        const res1 = await session.run(
            "MATCH (n:User {email: $email }) RETURN n",
            {
                email: email
            }
        );

        if (res1.records?.length !== 0) {
            const pom_user = res1.records[0]._fields[0].properties;
            if (pom_user.password)
                return res
                    .status(406)
                    .json({ message: "Vec si se registrovao bato" });
        }

        const salt = crypto.randomBytes(16).toString("hex");

        const hashedPassword = crypto
            .pbkdf2Sync(user.password, salt, 1000, 64, `sha512`)
            .toString(`hex`);

        await session
            .run(
                "MERGE (n:User {email: $email, name: $name, surname: $surname, password: $password, salt: $salt }) RETURN n AS User",
                {
                    email: email,
                    name: name,
                    surname: surname,
                    password: hashedPassword,
                    salt: salt
                }
            )
            .then(data => {
                session.close();
                const user = new User();
                user.makeUser(data.records[0].get("User"));
                RedisUser.saveUser(user);
                return res
                    .status(200)
                    .json({ message: "success", data: user.toShort() });
            })
            .catch(err => {
                console.error({ err });
                return res.status(500).json(err);
            });
    } catch (err) {
        return res.status(500).json(err);
    }
};

exports.log_in = async (req, res) => {
    const { email, password } = req.body;
    const emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!email || !email.match(emailFormat)) {
        return res.status(406).json({ message: "nevalidan mail" });
    }

    if (!password || password.length < 4) {
        return res
            .status(406)
            .json({ message: "Lozinka mora da bude duza od 6" });
    }

    try {
        let session = neo4j_client.session();

        await session
            .run("MATCH (n:User {email: $email}) RETURN n AS User", {
                email: email
            })
            .then(async data => {
                session.close();

                if (data.records.length === 0) {
                    return res.status(404).json({ message: "user not found" });
                }

                const user = new User();
                user.makeUser(data.records[0].get("User"));

                const salt = data.records[0].get("User").properties.salt;
                var hash = crypto
                    .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
                    .toString(`hex`);

                const validPassword = hash === user.password;

                if (!validPassword) {
                    return res
                        .status(406)
                        .json({ message: "losa sifra brabo" });
                }

                RedisUser.saveUser(user);
                return res
                    .status(200)
                    .json({ message: "success", data: user.toShort() });
            })
            .catch(err => {
                return res.status(500).json(err);
            });
    } catch (err) {
        return res.status(500).json(err);
    }
};

exports.subscribe = async (req, res) => {
    const { id, tag } = req.body;

    const tags = tag.split(",");

    if (!id) {
        return res.status(406).json({ message: "fali ti id" });
    }

    if (!tag.length) {
        return res.status(406).json({ message: "fale ti tagovi" });
    }

    //user exists 
    //tags exists 

    try {
        let session = neo4j_client.session();

        for (let i = 0; i < tags.length; i++) {
            await session.run(
                `MATCH (n:User), (t:Tag) 
                WHERE elementId(n) = $id AND t.naziv = $nazivTaga
                MERGE (n)-[:FOLLOW]->(t) RETURN n,t`,
                {
                    id: id,
                    nazivTaga: tags[i]
                }
            );
        }

        session.close();
        return res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json(err);
    }
};

exports.get_subs = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(406).json({ message: "fali ti id" });
    }

    try {
        let session = neo4j_client.session();

        const tags = new Set([]);

        await session
            .run(
                `MATCH ((t:Tag)<-[:FOLLOW]-(n:User WHERE elementId(n) = $id)) RETURN (t) as tags`,
                {
                    id: id
                }
            )
            .then(result => {
                result.records.forEach(r => {
                    const tag = new Tag("");
                    tag.makeTag(r.get("tags"));

                    tags.add(tag.naziv);
                });
            });

        session.close();
        return res.status(200).json({ message: "success", data: [...tags] });
    } catch (err) {
        return res.status(500).json(err);
    }
};

exports.unfollow = async (req, res) => {
    const { userId, tag } = req.body;

    if (!userId) {
        return res.status(406).json({ message: "fali ti id" });
    }
    if (!tag) {
        return res.status(406).json({ message: "fali ti tag" });
    }

    try {
        let session = neo4j_client.session();

        await session.run(
            `MATCH ((t:Tag {naziv: $tag})<-[r:FOLLOW]-(n:User WHERE elementId(n) = $id)) DELETE r`,
            {
                id: userId,
                tag: tag
            }
        );

        session.close();
        return res.status(200).json({ message: "success" });
    } catch (err) {
        return res.status(500).json(err);
    }
};

exports.moje_peticije = async (req, res) => {
    let { id } = req.params;

    if (!id) {
        return res.status(406).json({ message: "fali ti id" });
    }

    let session = neo4j_client.session();
    try {
        const p_res = await session
            .run(
                `MATCH (n:Peticija)<-[:WRITTEN]-(u:User WHERE elementId(u) = $id)
                RETURN (n) AS Peticija, (u) AS User`,
                {
                    id: id
                }
            )
            .then(result => {
                return result.records.map(r => {
                    const p = new Peticija();
                    p.makePeticija(r.get("Peticija"));

                    const u = new User();
                    u.makeUser(r.get("User"));

                    p.vlasnik = u.toShort();

                    return p;
                });
            });

        for (let i = 0; i < p_res.length; i++) {
            const peticija = p_res[i];
            const tags = new Set();
            await session
                .run(
                    `MATCH ((t:Tag)--(:Peticija {naslov:$naslov})) RETURN (t) as tags`,
                    {
                        naslov: peticija.naslov
                    }
                )
                .then(result => {
                    result.records.forEach(r => {
                        const tag = new Tag("");
                        tag.makeTag(r.get("tags"));
                        tags.add(tag.naziv);
                    });
                });

            peticija.tag = [...tags];
        }

        session.close();

        // RedisPeticija.savePeticijas(found_peticijas, req.query.filter);

        return res.status(200).json(p_res);
    } catch (err) {
        session.close();
        return res.status(500).json(err);
    }
};

exports.moji_blogovi = async (req, res) => {
    let { id } = req.params;

    if (!id) {
        return res.status(406).json({ message: "fali ti id" });
    }

    let session = neo4j_client.session();
    try {
        const b_res = await session
            .run(
                `MATCH (n:Blog)<-[:WRITTEN]-(u:User WHERE elementId(u) = $id)
                RETURN (n) AS Blog, (u) AS User`,
                {
                    id: id
                }
            )
            .then(result => {
                return result.records.map(r => {
                    const p = new Blog();
                    p.makeBlog(r.get("Blog"));

                    const u = new User();
                    u.makeUser(r.get("User"));

                    p.vlasnik = u.toShort();

                    return p;
                });
            });

        for (let i = 0; i < b_res.length; i++) {
            const blog = b_res[i];
            const tags = new Set();
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

        return res.status(200).json(b_res);
    } catch (err) {
        session.close();
        return res.status(500).json(err);
    }
};
