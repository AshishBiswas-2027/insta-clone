 const userModel = require("../models/user.model")
const crypto = require("crypto")
 const bcrypt  = require("bcryptjs")
 const jwt = require("jsonwebtoken")



const registerController = async function (req, res) {
    const { email, username, password, bio, profileImage } = req.body;

    // const isUserAlreadyExistsByEmail = await userModel.findOne({ email });

    // if (isUserAlreadyExistsByEmail) {
    //     return res.status(409).json({
    //         message:"User already exists with this username"
    //     })
    // }

    // const isUserAlreadyExistsByUsername = await userModel.findOne({ userName })
    
    // if (isUserAlreadyExistsByUsername) {
    //     return res.status(409).json({
    //         message:"User already exists with this username"
    //     })
    // 
    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(409).json({
            message:"User already exists"
        })
    }

    const hash = await bcrypt.hash(password,10)
    const user = await userModel.create({

        username,
        email,
        bio,
        profileImage,
        password:hash
    }

    )

    const token = jwt.sign({
        id: user._id,
        username: user.username

    }, process.env.JWT_SECRET, { expiresIn: "1d" })
    
    res.cookie("token", token)
    
    res.status(201).json({//never send a password in response
        message: "User registered successfully",
        user: {
            email:user.email,
            username: user.username,
            bio: user.bio,
            profileImage:user.profileImage
        }
    })
    

}

const loginController = async function (req, res) {
    const { username, email, password } = req.body
    const user = await userModel.findOne({
        $or: [{
            username:username
        }, {
            email:email
        }]
    })

    if (!user) {
        return res.status(404).json({
            message:"user not found"
        })
    }

    
    const isPasswordValid = await bcrypt.compare(password,user.password)
    
    if (!isPasswordValid) {
        return res.status(401).json({
            message:"Password invalid"
        })
    }

    const token = jwt.sign({ id: user._id, username:user.username }, process.env.JWT_SECRET, { expiresIn: '1d' })
    
    res.cookie("token",token)
    res.status(200).json({
        message: "User logged in",
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage:user.profileImage
        }
    })
    

}

const getMeController = async function (req, res) {
    const userId = req.user.id

    const user = await userModel.findById(userId)

    res.status(200).json({
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage:user.profileImage
        }
    })
}

module.exports = {
    loginController,
    registerController,
    getMeController
}