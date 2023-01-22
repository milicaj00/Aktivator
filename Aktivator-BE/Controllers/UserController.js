const neo4j_client = require("../neo4j.config.js");
const User = require("../Models/User");
const RedisUser = require("./RedisUser");
const bcrypt = require("bcrypt");
const Tag = require("../Models/Tag");

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

        const salt = await bcrypt.genSalt(16);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        await session
            .run(
                "MERGE (n:User {email: $email, name: $name, surname: $surname, password: $password }) RETURN n AS User",
                {
                    email: email,
                    name: name,
                    surname: surname,
                    password: hashedPassword
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

                const validPassword = await bcrypt.compare(
                    password,
                    user.password
                );

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

exports.getUser = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(406).json({ message: "fali ti id" });
    }

    try {
        let session = neo4j_client.session();

        await session
            .run("MATCH (n:User WHERE elementId(n) = $id) RETURN n AS User", {
                id: id
            })
            .then(data => {
                session.close();

                if (data.records.length === 0) {
                    return res.status(404).json({ message: "user not found" });
                }

                const user = new User();
                user.makeUser(data.records[0].get("User"));

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

    //user exists ??
    //tags exists ??

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
