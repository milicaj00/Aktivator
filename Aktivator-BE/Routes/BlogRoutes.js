const express = require("express");
const router = express.Router();
// import * as Blog from "../Controllers/BlogController";
const Blog = require("../Controllers/BlogController");

router.get("/allBlogs", Blog.getAllBlogs);
router.get("/singleBlog/:naslov", Blog.getSingleBlog);
router.get("/findBlog/:tag", Blog.findBlogs);
router.delete("/deleteBlog/:naslov", Blog.deleteBlog);
router.post("/addBlog", Blog.addBlog);

module.exports = router;
