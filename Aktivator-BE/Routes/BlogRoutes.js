const express = require("express");
const router = express.Router();
// import * as Blog from "../Controllers/BlogController";
const Blog = require("../Controllers/BlogController");
const redisBlogs = require("../Controllers/RedisBlog");
const helpers = require("../Controllers/helpers");

router.get("/singleBlog/:naslov", redisBlogs.getSingleBlog, Blog.getSingleBlog);
router.get("/findBlog", redisBlogs.getBlogs, Blog.findBlogs);
router.delete("/deleteBlog/:naslov", Blog.deleteBlog);
router.post("/addBlog", helpers.upload.single("slika"), Blog.addBlog);

module.exports = router;
