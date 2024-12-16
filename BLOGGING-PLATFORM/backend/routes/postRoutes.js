const express = require('express')
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const {post,allPosts, searchPosts,popularPost,category, singlePost,updateViews,userPosts,deletePost}=require("../controller/postController.js")

router.post("/post",post);
router.get("/all_posts",allPosts)
router.get("/singlepost",singlePost)
router.get("/search",searchPosts);
router.get("/popularPost",popularPost);
router.get("/category",category);
router.post("/updateviews",updateViews);
router.get("/user_posts",userPosts);
router.delete("/delete",deletePost)
module.exports=router