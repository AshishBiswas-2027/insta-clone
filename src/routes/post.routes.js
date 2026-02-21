const express = require("express")
const postController = require("../controller/post.controller")

const postRouter = express.Router()
const multer = require('multer')
const upload = multer({storage:multer.memoryStorage()})

postRouter.post("/", upload.single("image"), postController.createPostController)

postRouter.get("/", postController.getPostController)

postRouter.get("/details/:postId",postController.getPostDetailsController)

module.exports = postRouter