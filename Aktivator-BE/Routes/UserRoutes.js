const express = require("express");
const router = express.Router();
const User = require("../Controllers/UserController");
const redisUser = require("../Controllers/RedisUser");

router.post("/addUser", User.addUser);
router.post("/login", User.log_in);
router.post("/getUser", redisUser.getUser, User.getUser);
router.put("/subscribe", User.subscribe);
router.get("/get-subs/:id", User.get_subs);

module.exports = router;
