const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const jwt = require( "jsonwebtoken")

const imagekit = new ImageKit({
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req, res) {

    const token = req.cookies.token
    if (!token) {
        res.status(401).json({
            message:"Token not provided, unauthorized access"
        })
    }

    let decoded = null;
    try {
         decoded = jwt.verify(token, process.env.JWT_SECRET)//sign kaarte time jo data daalte hai wo aa jata hia decoded me 
    } catch (err) {
        res.status(401).json({
            message:"User not authorized"
        })
    }

    
    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "test",
        folder: "cohort2-insta-clone-posts"
    })

    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user:decoded.id
    })

    res.status(201).json({
        message: "post created successfully",
        post
    })

    res.send(file)
}

module.exports = {
    createPostController
}