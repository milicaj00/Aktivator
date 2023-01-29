const express = require("express");
const router = express.Router();
const User = require("../Controllers/UserController");
const redisUser = require("../Controllers/Redis/RedisUser");

router.post("/addUser", User.addUser);
router.post("/login", User.log_in);
router.post("/getUser", redisUser.getUser, User.getUser);
router.put("/subscribe", User.subscribe);
router.get("/get-subs/:id", User.get_subs);
router.get("/moje-peticije/:id", User.moje_peticije);
router.get("/moji-blogovi/:id", User.moji_blogovi);

module.exports = router;
