const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Role = require('../models/roleModel')
const Permission = require('../models/permissionModel')
const Class = require('../models/classModel')
const Enrollment = require('../models/enrollmentModel')
const e = require("express")
const mongoose = require("mongoose")
const {sendEmail} = require("./emailController")

/**
 * @desc Get users
 * @route GET /api/users
 * @access Private
 */
const getUsers = asyncHandler(async (req, res) => {
    let arg = {}
    if(req.query.id) {
        const ids = typeof req.query.id == "string" ? new mongoose.Types.ObjectId(req.query.id) 
        : req.query.id.map((id) => new mongoose.Types.ObjectId(id))
        arg = {_id: {$in: ids}}
    }

    if(req.query.keyword) {
        const keyword = new RegExp(".*" + req.query.keyword + ".*", "i")
        arg = {...arg, $or: [{firstName: {$regex: keyword}},{lastName: {$regex: keyword}}]}
    }

    const users = await User.find(arg).select("-password")

    res.status(200).json(users)
})

/**
 * @desc Create new user
 * @route POST /api/users
 * @access Private
 */
const createUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, roles } = req.body

    if(!firstName || !lastName || !email || !roles || !roles.length) {
        res.status(400)
        throw new Error("Please fill all required fields")
    }

    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400)
        throw new Error("User with this email already exists")
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password ? password : Math.random().toString(36).slice(-8), salt)

    const user = await User.create({
        firstName,
        otherNames: req.body.otherNames,
        lastName,
        email,
        phone: req.body.phone,
        roles: req.body.roles,
        estraPerms: req.body.extraPerms,
        password: hashedPassword,
    })

    if (user) {
        const url = process.env.FRONTEND_URL + "/" + user._id.toString() + "/" + generateToken(user._id)

        try {
            await sendEmail("crsis@noreplycris.com", user.email, "", "New account",
            "<div>" +
            "<p>Dear " + user.firstName + " " + user.lastName + ",</p>" +
            "<p>sending you a link for resetting your password.</p>" +
            "<p><a href=" + url + " >Click here to set new password and sign in!</a></p>" +
            "</ br>" +
            "<p>You have a week to set it.</p>" +
            "<p>If you won't set it in a week <a href='http://localhost:3000/login/" + user.email + "'>click here</a>.</p>" +
            "<p>crsis</p>"
            )
        } catch(error) {
            res.status(500);
            throw new Error(error)
        }

        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            otherNames: user.otherNames,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            roles: user.roles,
            estraPerms: user.extraPerms,
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})

/**
 * @desc Register new user
 * @route POST /api/users
 * @access Private?
 */
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, password1, roles } = req.body

    if(!firstName || !lastName || !email || !password || !roles.length) {
        res.status(400)
        throw new Error("Please fill all required fields")
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
        roles: user.roles,
        estraPerms: user.extraPerms,
        password: hashedPassword,
    })

    if (user && password == password1) {
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            otherNames: user.otherNames,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            roles: user.roles,
            estraPerms: user.extraPerms,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }
})

/**
 * @desc Authenticate a user
 * @route POST /api/users/login
 * @access Public
 */
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
            roles: permsRoles.userRoles,
            rolePermissions: permsRoles.rolePermissions,
            extraPerms: permsRoles.userPermissions,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid credentials")
    }
})

/**
 * @desc Send email with link for forgotten password
 * @route POST /api/users/forgotPassword
 * @access PublicsetNewPassword
 */
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({email})

    if (user) {
        const url = process.env.FRONTEND_URL + "/" + user._id.toString() + "/" + generateToken(user._id)
        try {
            await sendEmail("crsis@noreplycris.com", email, "", "Forgotten password",
            "<div>" +
            "<p>Dear user,</p>" +
            "<p>sending you a link for resetting your password.</p>" +
            "<p><a href=" + url + " >Click here to reset your password!</a></p>" +
            "</ br>" +
            "<p>You have a week to change it.</p>" +
            "<p>crsis</p>"
            )
    
            res.status(200);
        } catch (error) {
            res.status(500).json(error.message);
        }
    } else {
        res.status(400)
        throw new Error("Invalid email")
    }
})

/**
 * @desc Send email with link for forgotten password
 * @route POST /api/users/forgotPassword
 * @access Public
 */
const setNewPassword = asyncHandler(async (req, res) => {
    const { userId, password, password1 } = req.body

    const user = await User.findOne({userId})

    if (user && password === password1) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const updatedUser = await User.findByIdAndUpdate(userId, {$set: {password: hashedPassword}}, {
            new: true,
        })

        const permsRoles = await getRolesAndPermsNames(updatedUser)

        res.json({
            _id: updatedUser.id,
            firstName: updatedUser.firstName,
            otherNames: updatedUser.otherNames,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            roles: permsRoles.userRoles,
            rolePermissions: permsRoles.rolePermissions,
            extraPerms: permsRoles.userPermissions,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid email")
    }
})

/**
 * @desc Get user data
 * @route GET /api/users/me
 * @access Private
 */
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

/**
 * Generate JWT with userId
 * 
 * @param {string} id 
 * @returns 
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })
}

/**
 * @desc Update user
 * @route PUT /api/users/:id
 * @access Private
 */
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    const {password, password1} = req.body

    if(!user) {
        res.status(400)
        throw new Error("User not find")
    }

    if(password && password === password1) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        req.body.password = hashedPassword
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    const permsRoles = await getRolesAndPermsNames(updatedUser)

    res.status(200).json({
        _id: updatedUser.id,
        firstName: updatedUser.firstName,
        otherNames: updatedUser.otherNames,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        roles: permsRoles.userRoles,
        rolePermissions: permsRoles.rolePermissions,
        extraPerms: permsRoles.userPermissions,
    })
})

/**
 * @desc Delete user by id
 * @route DELETE /api/users/:id
 * @access Private
 */
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if(!user) {
        res.status(400)
        throw new Error("Role not find")
    }

    await Enrollment.updateMany({student: user._id}, {$pull: {student: user._id}}, {multi: true})
    await Class.updateMany({lectors: user._id}, {$pull: {lectors: user._id}}, {multi: true})

    await user.remove()

    res.status(200).json({id: req.params.id})
})

/**
 * Gets user role names and perms names
 * (extraPerms and role perms)
 * 
 * @param {Object} user 
 * @returns permsRoles (name of roles and perms)
 */
async function getRolesAndPermsNames(user) {
    const cache = {roles: [], permissions: []}

    await Role.find({}).select("_id name permissions").then((roles) => {
        cache.roles = roles;
    }).catch((e) => {throw new Error(e)})

    await Permission.find({}).select("_id name").then((permissions) => {
        cache.permissions = permissions;
    }).catch((e) => {throw new Error(e)})

    const permsRoles = {userRoles: [], rolePermissions: [], userPermissions: []}

    for(const roleId of user.roles) {
        permsRoles.userRoles.push(getValue(cache.roles, roleId).name)
        for (const permId of getValue(cache.roles, roleId).permissions) {
            permsRoles.rolePermissions.push(getValue(cache.permissions, permId).name)
        }
    }

    for (const extraPermId of user.extraPerms) {
        let permName = getValue(cache.permissions, extraPermId).name
        if (!permsRoles.rolePermissions.includes(permName)) {
            permsRoles.userPermissions.push(permName)
        }
    }

    permsRoles.userPermissions = [...permsRoles.userPermissions, ...permsRoles.rolePermissions]

    return permsRoles
}

/**
 * Gets roles names by roles ids
 * 
 * @param {Map} rolesIds 
 * @returns rolesNames
 */
async function getRolesNames(rolesIds) {
    let rolesOut = []

    await Role.find({}).select("_id name").then((roles) => {
        rolesOut = roles;
    }).catch((e) => {throw new Error(e)})

    let rolesNames = new Map()
    for(const roleId of rolesIds) {
        let roleName = rolesOut.map(role => {
            if(roleId.toString() === role._id.toString()) return role.name
            else return null
        }).filter(role => role != null).flat()
        rolesNames.set(roleId, roleName)
    }

    return rolesNames
}

function getValue(object, id) {
    return Object.values(object).find((perm) => perm._id.toString() == id)
}

module.exports = {
    getUsers,
    registerUser,
    loginUser,
    forgotPassword,
    setNewPassword,
    getMe,
    updateUser,
    createUser,
    deleteUser,
}