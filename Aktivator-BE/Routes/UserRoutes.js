const express = require("express");
const router = express.Router();
const User = require("../Controllers/UserController");
const redisUser = require("../Controllers/RedisUser");

router.post("/addUser", User.addUser);
router.post("/login", User.log_in);
router.post("/getUser", redisUser.getUser, User.getUser);

module.exports = router;
