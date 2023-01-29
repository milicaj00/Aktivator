const express = require("express");
const cors = require("cors");
require('dotenv').config();
require("./ws.config.js");
require("./redis.config.js");
require("./neo4j.config.js");

const blogRoutes = require("./Routes/BlogRoutes");
const peticijaRoutes = require("./Routes/PeticijaRoutes");
const tagRoutes = require("./Routes/TagRoutes");
const userRoutes = require("./Routes/UserRoutes");

const app = express();
app.use(express.json());



app.use(express.static("Photos"));

app.use(cors());

app.use("/api/blog", blogRoutes);
app.use("/api/peticija", peticijaRoutes);
app.use("/api/tag", tagRoutes);
app.use("/api/user", userRoutes);

app.listen(3005, () => {
    console.log("Server is listening on port 3005.");
});

// app.get("/slika/:slika", (req, res) => {
//     res.sendFile("../Photos/" + req.params.slika, { root: "__Aktivator-BE" });
// });

//neo4j
// start C:\neo4j-community-5.3.0\bin\neo4j console
//http://localhost:7474
//sifra aktivator
