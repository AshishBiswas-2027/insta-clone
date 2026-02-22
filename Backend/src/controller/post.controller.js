const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken")
const likeModel = require("../models/likes.model")


const imagekit = new ImageKit({
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req, res) {
    
    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "test",
        folder: "cohort2-insta-clone-posts"
    })

    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user:req.user.id
    })

    res.status(201).json({
        message: "post created successfully",
        post
    })

    res.send(file)
}

async function getPostController(req, res) {

    const userId = req.user.id

    const posts = await postModel.find({
        user: userId
    })

    res.status(200).json({
        message: "Posts fetched successfullly ",
        posts
        
    })


}

async function getPostDetailsController(req, res) {
    
    const userId = req.user.id;
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if (!post) {
        return res.status(404).json({
            message:"post not found"
        })
    }

    const isValidUser = post.user.toString() === userId

    if (!isValidUser) {
        return res.status(403).json({
            message:"Forbidden content"
        })
    }

    res.status(200).json({
        message: "Post fetched successfully",
        post
    })
}

async function likePostController(req, res) {

    const username = req.user.username
    const postId = req.params.postId

    const post = await likeModel.findById(postId)

    if (!post) {
        res.status(400).json({
            message:"Post not found"

        })
    }

    const like = await likeModel.create({
        post: postId,
        user:username
    })

    res.status(200).json({
        message:"Post liked successfully"
    })
    
}

module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController,
    likePostController
}