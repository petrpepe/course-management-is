const asyncHandler = require('express-async-handler')
const Role = require('../models/roleModel')
const User = require('../models/userModel')

/**
 * @desc Get Roles
 * @route GET /api/Roles
 * @access Private
 */
const getRoles = asyncHandler(async (req, res) => {
    const Roles = await Role.find()

    res.status(200).json(Roles)
})

/**
 * @desc Create role
 * @route POST /api/role
 * @access Private
 */
const setRole = asyncHandler(async (req, res) => {
    if(!req.body.name){
        res.status(400)
        throw new Error("Please add name")
    }

    const role = await Role.create(req.body)

    res.status(200).json(role)
})

/**
 * @desc Update role by id
 * @route PUT /api/roles/:id
 * @access Private
 */
const updateRole = asyncHandler(async (req, res) => {
    const role = await Role.findById(req.params.id)

    if(!role) {
        res.status(400)
        throw new Error("Role not find")
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
    const role = await Role.findById(req.params.id)

    if(!role) {
        res.status(400)
        throw new Error("Role not find")
    }

    await User.updateMany({roles: role._id}, {$pull: {roles: role._id}}, {multi: true})

    await role.deleteOne()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getRoles,
    setRole,
    updateRole,
    deleteRole
}