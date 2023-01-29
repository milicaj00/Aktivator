const neo4j_client = require("../neo4j.config.js");
const RedisPeticija = require("./Redis/RedisPeticija");
const helpers = require("./helpers");
const redis_client = require("../redis.config.js");
const Peticija = require("../Models/Peticija");
const User = require("../Models/User");
const Tag = require("../Models/Tag");

exports.getSinglePeticija = async (req, res) => {
    if (!req.params.naslov || req.params.naslov === "") {
        return res.status(406).json({ message: "Morate uneti naslov" });
    }
    let session = neo4j_client.session();
    try {
        // const tags = await session
        //     .run(
        //         `MATCH ((t:Tag)--(:Peticija {naslov:$naslov})) RETURN (t) as tags`,
        //         {
        //             naslov: req.params.naslov
        //         }
        //     )
        //     .then(result => {
        //         return result.records.map(r => {
        //             const tag = new Tag("");
        //             tag.makeTag(r.get("tags"));
        //             return tag.naziv;
        //         });
        //     });

        const p_res = await session
            .run(
                `MATCH ((t:Tag)--(n:Peticija {naslov:$naslov})<-[:WRITTEN]-(u:User)) RETURN (n) AS peticija, (u) as user, (t) AS Tag`,
                {
                    naslov: req.params.naslov
                }
            )
            .then(result => {
                let p = null;
                let user = null;
                result.records.map(r => {
                    if (!p) {
                        p = new Peticija();
                        p.makePeticija(r.get("peticija"));
                    }
                    if (!user) {
                        user = new User();
                        user.makeUser(r.get("user"));
                        p.vlasnik = user.toShort();
                    }

                    const tag = new Tag("");
                    tag.makeTag(r.get("tag"));
                    p.tag.push(tag);
                });
                return p;
            });

        session.close();
        // if (p_res.length !== 1) {
        //     return res.status(404).json({ message: "Peticija not found" });
        // }

        if (!p_res) {
            return res.status(404).json({ message: "Peticija not found" });
        }

        RedisPeticija.saveSinglePeticija(p_res);

        return res.status(200).json(p_res);
    } catch (err) {
        session.close();

        return res.status(500).json(err);
    }
};

exports.findPeticijas = async (req, res) => {
    const filter = req.query.filter
        ? ".*" + req.query.filter.toLowerCase() + ".*"
        : ".*";

    let session = neo4j_client.session();
    try {
        const p_res = await session
            .run(
                `MATCH (t:Tag WHERE toLower(t.naziv) =~ $nazivTaga)-[:TAGGED]->(n:Peticija)
                <-[:WRITTEN]-(u:User WHERE toLower(u.name) =~ $userName AND toLower(u.surname) =~ $userSurname) 
                RETURN (n) AS Peticija, (t) AS Tag, (u) AS User`,
                {
                    nazivTaga: filter,
                    userName: ".*",
                    userSurname: ".*"
                }
            )
            .then(result => {
                let pomB = new Peticija();
                return result.records.map(r => {
                    const p = new Peticija();
                    p.makePeticija(r.get("Peticija"));
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

        const found_peticijas = [...new Set(p_res)];

        for (let i = 0; i < found_peticijas.length; i++) {
            const peticija = found_peticijas[i];
            const tags = new Set(peticija.tag);
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

        RedisPeticija.savePeticijas(found_peticijas, req.query.filter);

        return res.status(200).json(found_peticijas);
    } catch (err) {
        session.close();
        return res.status(500).json(err);
    }
};

exports.editPeticija = async (req, res) => {
    const { naslov, user_name, user_surname, user_email } = req.body;

    if (!naslov || naslov.length < 5) {
        return res.status(406).json({ message: "Naslov mora biti duzi od 5" });
    }
    if (!user_name) {
        return res.status(406).json({ message: "morate uneti ime" });
    }
    if (!user_surname) {
        return res.status(406).json({ message: "Morate uneti prezime" });
    }
    if (!user_email) {
        return res.status(406).json({ message: "Nemas mail od usera" });
    }
    let session = neo4j_client.session();

    try {
        const p_res = await session.run(
            // `MATCH (p:Peticija {naslov:$naslov})-[:SIGNED]->(u:User {email : $user_email})
            // SET p.broj_potpisa = p.broj_potpisa+1 RETURN p AS Peticija`,
            `MATCH (node:Peticija {naslov:$naslov}) 
             WHERE NOT (node)-[:SIGNED]->(:User {email : $user_email}) 
             SET node.broj_potpisa = node.broj_potpisa+1
             RETURN node AS Peticija`,

            {
                naslov: naslov,
                user_email: user_email
            }
        );

        if (p_res.records.length === 0) {
            return res.status(404).json({ message: "vec si potpiso bato" });
        }
        if (!p_res.records[0].get("Peticija")) {
            return res.status(406).json({ message: "vec si potpiso bato" });
        }

        const peticija = new Peticija();
        peticija.makePeticija(p_res.records[0].get("Peticija"));

        await session.run(
            "MERGE (n:User {email: $email , name: $name , surname: $surname }) RETURN n",
            {
                email: user_email,
                name: user_name,
                surname: user_surname
            }
        );

        await session.run(
            `MATCH (b:Peticija), (u:User) 
            WHERE b.naslov = $naslovPeticije AND u.email = $user_email
            MERGE (b)-[:SIGNED]->(u) RETURN b,u`,
            {
                naslovPeticije: naslov,
                user_email: user_email
            }
        );

        session.close();
        return res.status(200).json({ message: "Succces", data: peticija });
    } catch (err) {
        session.close();

        return res.status(500).json(err);
    }
};

exports.addPeticija = async (req, res) => {
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

    const image = await helpers.makeImage(req.file, "Peticija " + naslov);
    if (image === false) {
        return res.status(500).json({ message: "Doslo je do greske" });
    }

    let session = neo4j_client.session();
    try {
        const peticija = new Peticija();
        peticija.naslov = naslov;
        peticija.text = text;
        peticija.tag = tag.split(",");

        const peticija_exsts = await session.run(
            `MATCH (n:Peticija {naslov: $naslov }) RETURN n.naslov`,
            {
                naslov: peticija.naslov
            }
        );

        if (peticija_exsts.records.length !== 0) {
            return res.status(406).json({ message: "Peticija already exists" });
        }

        const tag_res = await session.run(
            "MATCH (n:Tag) where n.naziv IN $naziv RETURN coalesce(n.naziv) as naziv, elementId(n) as id",
            {
                naziv: peticija.tag
            }
        );

        const tag_list = tag_res.records.map(record => record.get("naziv"));
        const newTags = peticija.tag.filter(el => !tag_list.includes(el));

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
            "MERGE (n:Peticija {naslov: $naslov , text: $text, broj_potpisa:0, slika: $slika }) RETURN n.naslov",
            {
                naslov: peticija.naslov,
                text: peticija.text,
                slika: image
            }
        );

        const user = new User();
        await session
            .run(
                `MATCH (b:Peticija), (u:User) 
            WHERE b.naslov = $naslovPeticije AND u.email = $user_email
            MERGE (u)-[write:WRITTEN]->(b) RETURN (u) AS User`,
                {
                    naslovPeticije: peticija.naslov,
                    user_email: user_email
                }
            )
            .then(result => {
                user.makeUser(result.records[0].get("User"));
            });

        for (let i = 0; i < peticija.tag.length; i++) {
            await session.run(
                `MATCH (b:Peticija), (t:Tag) 
                WHERE b.naslov = $naslovPeticije AND t.naziv = $nazivTaga
                MERGE (t)-[tag:TAGGED]->(b) RETURN t,b`,
                {
                    nazivTaga: peticija.tag[i],
                    naslovPeticije: peticija.naslov
                }
            );
        }
        RedisPeticija.deleteAllPeticijas();

        redis_client.publish(
            "tag:user",
            JSON.stringify({
                tag: peticija.tag,
                naslov: peticija.naslov,
                message: "Nova peticija ",
                userId: user.id
            })
        );

        session.close();
        return res.status(200).json({ message: "success" });
    } catch (err) {
        session.close();
        return res.status(500).json({ err });
    }
};

exports.deletePeticija = async (req, res) => {
    if (!req.params.naslov || req.params.naslov === "") {
        return res.status(406).json({ message: "Morate uneti naslov" });
    }
    const session = neo4j_client.session();
    try {
        await session.run(
            `MATCH (n:Peticija {naslov: $naslov }) DETACH DELETE n`,
            {
                naslov: req.params.naslov
            }
        );
        RedisPeticija.deleteAllPeticijas();
        session.close();
        return res.status(200).json({ message: "Ide gas" });
    } catch (err) {
        session.close();

        return res.status(500).json({ err });
    }
};
