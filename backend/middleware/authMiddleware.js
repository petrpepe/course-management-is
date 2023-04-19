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

            await populateCache()

            req.userRoles = req.user.roles.map(userRole => 
                cache.roles.filter(cacheRole => cacheRole._id.equals(userRole))[0].name
            )

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

const authorize = (permissions) => {
    return asyncHandler( async (req, res, next) => {
    let token = ""

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id).select("-password")

        if(!token || (!req.user.roles && req.user._id.toString() !== req.query.id)) {
            res.status(403)
            throw new Error("Forbidden")
        }

        if (!permissions) {
            res.status(403)
            throw new Error("Forbidden")
        }

        if (permissions.includes("userDelete") && req.user._id.toString() === req.query.id) {
            res.status(400)
            throw new Error("You can't delete yourself")
        }

        const user = req.user
        let contains = new Map()

        if (typeof permissions === "string") contains.set(permissions, false)
        else {
            for (const perm of permissions) {
                contains.set(perm, false)
            }
        }

        for(const roleId of user.roles) {
            for (const permId of getValue(cache.roles, roleId).permissions) {
                const permName = getValue(cache.permissions, permId).name
                if (contains.has(permName)) contains.set(permName, true)
            }
        }

        for (const extraPermId of user.extraPerms) {
            const permName = getValue(cache.permissions, extraPermId).name
            if (contains.has(permName)) contains.set(permName, true)
        }
    
        if (user && Array.from(contains.values()).every(e => e === true)) {
            next();
        } else {
            res.status(403)
            throw new Error("Forbidden")
        }
    }
})
}

async function populateCache() {
    await Role.find({}).select("_id name permissions").then((roles) => {
        cache.roles = roles;
    }).catch((e) => {throw new Error(e)})

    await Permission.find({}).select("_id name").then((permissions) => {
        cache.permissions = permissions;
    }).catch((e) => {throw new Error(e)})
}

function getValue(array, id) {
    return array.filter((value) => value._id.equals(id))[0]
}

module.exports = { authenticate, authorize }