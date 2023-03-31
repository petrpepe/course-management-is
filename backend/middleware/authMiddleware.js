const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Role = require('../models/roleModel')
const Permission = require('../models/permissionModel')

let cache = {roles: [], permissions: []}

const authenticate = asyncHandler(async (req, res, next) => {
    let token = ""

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select("-password")

            next()
        } catch (error) {
            res.status(401)
            throw new Error("Unauthorized, invalid token")
        }
    }

    if(!token) {
        res.status(401)
        throw new Error("Unauthorized, invalid TOKEN")
    }
})

const authorize = (permissions) => {
    return asyncHandler( async (req, res, next) => {
        const { user } = req
        let contains = false

        if (!permissions) {
            res.status(403)
            throw new Error("Forbidden")
        }

        await populateCache()

        for(const roleId of user.roles) {
            for (const permId of getValue(cache.roles, roleId).permissions) {
                if (permissions.includes(getValue(cache.permissions, permId).name)) contains = true
            }
        }
    
        for (const extraPermId of user.extraPerms) {
            if(permissions.includes(getValue(cache.permissions, extraPermId)).name) contains = true
        }
    
        if (user && contains) {
            next();
        } else {
            res.status(403)
            throw new Error("Forbidden")
        }
    })
}

async function populateCache() {
    await Role.find({}).select("permissions").then((roles) => {
        cache.roles = roles;
    }).catch((e) => {throw new Error(e)})

    await Permission.find({}).select("name").then((permissions) => {
        cache.permissions = permissions;
    }).catch((e) => {throw new Error(e)})
}

function getValue(object, id) {
    return Object.values(object).find((perm) => perm._id.toString() == id)
}

module.exports = { authenticate, authorize }