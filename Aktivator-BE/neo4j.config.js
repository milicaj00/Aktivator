let neo4j = require("neo4j-driver");

const creds = {
    neo4jusername: "neo4j",
    neo4jpw: "aktivator"
};

let driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic(creds.neo4jusername, creds.neo4jpw)
);

module.exports = driver;
