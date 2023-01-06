const neo4j_client = require("../neo4j.config.js");
const Tag = require('../Models/Tag')

exports.addTag = async (req, res) => {
    const { naziv } = req.body;
    if(!naziv || naziv === '' || naziv === ' '){
        return res.status(406).json({message:'Morate uneti naziv taga'})
    }
    try {
        let session = neo4j_client.session();

        const tag = new Tag();
        tag.naziv = naziv;

        await session
            .run(
                "Merge (n:Tag {naziv: $naziv }) RETURN n",
                {
                    naziv: naziv,
                }
            )
            .then(data => {
                session.close();
                // console.log({ data });
                return res.status(200).json({ message: "success" });
            })
            .catch(err => {
                console.error({ err });
                return res.status(500);
            });
    } catch (err) {
        return res.status(500).json(err);
    }

    // return res.status(500).json({ message: "ne znam sto je puko" });
};