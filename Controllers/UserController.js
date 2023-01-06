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

    // return res.status(500).json({ message: "ne znam sto je puko" });
};
