const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel');
const e = require("express");

// @desc Get users
// @route GET /api/users
// @access Private
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find()

    res.status(200).json(users)
})

// @desc Register new user
// @route POST /api/users
// @access Private?
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    if(!firstName || !lastName || !email || !password) {
        res.status(400)
        throw new Error("Please fill all fields")
    }

    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }

    // Hash pwd
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password} = req.body

    const user = await User.findOne({email})

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roles: user.roles,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error("Invalid credentials")
    }
})

// @desc Get user data
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })
}

// @desc Update user
// @route PUT /api/users/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    const {password} = req.body

    if(!user) {
        res.status(400)
        throw new Error("User not find")
    }

    if(password) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        req.body.password = hashedPassword
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    }).select("-password", )

    res.status(200).json(updatedUser)
})

module.exports = {
    getUsers,
    registerUser,
    loginUser,
    getMe,
    updateUser,
}