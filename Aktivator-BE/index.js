const express = require("express");
const cors = require("cors");
const redis_client = require("./ws.config.js");
//const redis_client = require("./redis.config.js");
const neo4j_client = require("./neo4j.config.js");

const blogRoutes = require("./Routes/BlogRoutes");
const peticijaRoutes = require("./Routes/PeticijaRoutes");
const tagRoutes = require("./Routes/TagRoutes");
const userRoutes = require("./Routes/UserRoutes");

const app = express();
app.use(express.json());

app.use(cors());

// async function setDataToRedis(req, res, next) {
//     try {
//         const { name } = req.params;
//         redis_client.setEx(name, 3600, "repos");

//         res.send(`<h1>${name} written to redis</h1>`);
//     } catch (e) {
//         res.status(500);
//     }
// }

// app.get("/getName/:name", setDataToRedis);

// const setDataToNeo = async function (req, res) {
//     let session = neo4j_client.session();
//     const { name } = req.params;

//     await session
//         .run("MERGE (n:user {name: $id}) RETURN n", {
//             id: name
//         })
//         .then(data => {
//             session.close();
//         })
//         .catch(err => {
//             console.error({ err });
//             return res.status(500);
//         });

//     return res.status(200);
// };

// app.get("/addUser/:name", setDataToNeo);

// const hello = (req, res) => {
//     try {
//         res.send(`<h1>hello</h1>`);
//     } catch (e) {
//         res.status(500);
//     }
// };
// app.get("/hi", hello);

app.use("/api/blog", blogRoutes);
app.use("/api/peticija", peticijaRoutes);
app.use("/api/tag", tagRoutes);
app.use("/api/user", userRoutes);

app.listen(3000, () => {
    console.log("Server is listening on port 3000.");
});

//neo4j
// start C:\neo4j-community-5.3.0\bin\neo4j console
//http://localhost:7474
//sifra aktivator
