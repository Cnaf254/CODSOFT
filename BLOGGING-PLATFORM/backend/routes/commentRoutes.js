const express = require('express')
const router = express.Router();
const { StatusCodes } = require("http-status-codes");

const {comment,allComments}=require("../controller/commentController.js")

router.post("/comment",comment);
router.get("/all_comments",allComments)

module.exports=router