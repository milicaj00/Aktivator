const express = require("express");
const router = express.Router();
const Tag = require("../Controllers/TagController");

router.post("/addTag", Tag.addTag);

module.exports = router;
