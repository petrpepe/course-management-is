const asyncHandler = require('express-async-handler')
const Role = require('../models/RoleModel');

// @desc Get Roles
// @route GET /api/Roles
// @access Private
const getRoles = asyncHandler(async (req, res) => {
    const Roles = await Role.find()

    res.status(200).json(Roles)
})

// @desc Get Role by id
// @route GET /api/Roles
// @access Private
const getRoleById = asyncHandler(async (req, res) => {
    const Roles = await Role.findById(req.params.id)

    res.status(200).json(Roles)
})

// @desc Create role
// @route POST /api/role
// @access Private
const setRole = asyncHandler(async (req, res) => {
    if(!req.body.name){
        res.status(400)
        throw new Error("Please add text")
    }

    const role = await Role.create({
        name: req.body.name,
        description: req.body.description,
        permissions: req.body.permissions,
    })

    res.status(200).json(role)
})

// @desc Update role by id
// @route PUT /api/roles/:id
// @access Private
const updateRole = asyncHandler(async (req, res) => {
    const Role = await Role.findById(req.params.id)

    if(!Role) {
        res.status(400)
        throw new Error("Role not find")
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if(Role.user.toString() != req.user.id) {
        res.status(403)
        throw new Error("User not authorized")
    }

    const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedRole)
})

/**
 * @desc Delete role by id
 * @route DELETE /api/roles/:id
 * @access Private
 */
const deleteRole = asyncHandler(async (req, res) => {
    const Role = await Role.findById(req.params.id)

    if(!Role) {
        res.status(400)
        throw new Error("Role not find")
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if(Role.user.toString() != req.user.id) {
        res.status(403)
        throw new Error("User not authorized")
    }

    await Role.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getRoles,
    getRoleById,
    setRole,
    updateRole,
    deleteRole
}