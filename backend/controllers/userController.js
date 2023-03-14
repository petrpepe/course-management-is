const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel');
const Role = require('../models/roleModel')
const Permission = require('../models/permissionModel')
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
    const { firstName, lastName, email, password, roles } = req.body

    if(!firstName || !lastName || !email || !password || !roles.length) {
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
        otherNames: user.otherNames,
        lastName,
        email,
        phone: user.phone,
        courses: user.courses,
        roles: user.roles,
        estraPerms: user.extraPerms,
        password: hashedPassword,
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            otherNames: user.otherNames,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            courses: user.courses,
            roles: user.roles,
            estraPerms: user.extraPerms,
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
                    
        const permsRoles = await getRolesAndPermsNames(user)

        res.json({
            _id: user.id,
            firstName: user.firstName,
            otherNames: user.otherNames,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            courses: user.courses,
            roles: user.roles,
            estraPerms: user.extraPerms,
            token: generateToken(user._id),
            permsRoles: permsRoles
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

async function getRolesAndPermsNames(user) {
    let cache = {roles: [], permissions: []}

    await Role.find({}).select("_id name permissions").then((roles) => {
        cache.roles = roles;
    }).catch((e) => {throw new Error(e)})

    await Permission.find({}).select("_id name").then((permissions) => {
        cache.permissions = permissions;
    }).catch((e) => {throw new Error(e)})

    const permsRoles = {userRoles: [], userPermissions: []}

    for(const roleId of user.roles) {
        permsRoles.userRoles += getValue(cache.roles, roleId).name
        for (const permId of getValue(cache.roles, roleId).permissions) {
            permsRoles.userPermissions += getValue(cache.permissions, permId).name
        }
    }

    for (const extraPermId of user.extraPerms) {
        let permName = getValue(cache.permissions, extraPermId).name
        if (!permsRoles.userPermissions.includes(permName)) {
            permsRoles.userPermissions += permName
        }
    }

    return permsRoles
}

function getValue(object, id) {
    return Object.values(object).find((perm) => perm._id.toString() == id)
}

module.exports = {
    getUsers,
    registerUser,
    loginUser,
    getMe,
    updateUser,
}