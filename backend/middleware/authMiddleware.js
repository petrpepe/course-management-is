const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const {getRoles} = require('../controllers/roleController');

const authenticate = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select("-password")

            next()
        } catch (error) {
            res.status(401)
            throw new Error("Unauthorized")
        }
    }

    if(!token) {
        res.status(401)
        throw new Error("Unauthorized")
    }
})

const authorize = asyncHandler(async (...permittedRoles) => {
    return (req, res, next) => {
        const { user } = req
    
        if (user && checkPermission(user)) {
            next();
        } else {
            res.status(403)
            throw new Error("Forbidden " + JSON.stringify(req.user))
        }
    }
})

const checkPermission = (permissions) => {
    let contains = false;

    for(let permission of user.roles.permissions) {
        if (permissions.includes(permission)) return contains = true
    }

    if(user.extraPerms.some(extraPerm => permissions.includes(extraPerm))) {
        return contains = true
    }

    return contains
}

module.exports = { authenticate, authorize }