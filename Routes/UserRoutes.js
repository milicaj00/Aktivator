const express = require("express");
const router = express.Router();
const User = require("../Controllers/UserController");

router.post("/addUser", User.addUser);

module.exports = router;
