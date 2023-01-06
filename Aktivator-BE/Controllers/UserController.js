const neo4j_client = require("../neo4j.config.js");
const User = require("../Models/User");

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
    if (password && password.length < 6) {
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

        await session
            .run(
                "MERGE (n:User {email: $email , name: $name , surname: $surname, password: $password }) RETURN n",
                {
                    email: email,
                    name: name,
                    surname: surname,
                    password: user.password
                }
            )
            .then(data => {
                session.close();
                // console.log({ data });
                return res.status(200).json({ message: "success" });
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

    if (password && password.length < 4) {
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
            .then(data => {
                session.close();

                if (data.records.length === 0) {
                    return res.status(404).json({ message: "user not found" });
                }

                const user = new User();
                user.makeUser(data.records[0].get("User"));

                if (user.password !== password) {
                    return res
                        .status(402)
                        .json({ message: "losa sifra brabo" });
                }

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
