const express = require('express')
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const {post,allPosts, searchPosts}=require("../controller/postController.js")

router.post("/post",post);
router.get("/all_posts",allPosts)
router.get("/search",searchPosts);
module.exports=router