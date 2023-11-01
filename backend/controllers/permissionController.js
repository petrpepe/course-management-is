const asyncHandler = require('express-async-handler')
const Permission = require('../models/permissionModel');

/**
 * @desc Get Permissions
 * @route GET /api/Permissions
 * @access Private
 */
const getPermissions = asyncHandler(async (req, res) => {
    const permissions = await Permission.find()

    res.status(200).json(permissions)
})

/**
 * @desc Create permission
 * @route POST /api/permission
 * @access Private
 */
const setPermission = asyncHandler(async (req, res) => {
    if(!req.body.name){
        res.status(400)
        throw new Error("Please add some name")
    }

    const permission = await Permission.create(req.body)

    res.status(200).json(permission)
})

/**
 * @desc Update permission by id
 * @route PUT /api/permissions/:id
 * @access Private
 */
const updatePermission = asyncHandler(async (req, res) => {
    const permission = await Permission.findById(req.params.id)

    if(!permission) {
        res.status(400)
        throw new Error("Permission not find")
    }

    const updatedPermission = await Permission.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedPermission)
})

/**
 * @desc Delete permission by id
 * @route DELETE /api/permissions/:id
 * @access Private
 */
const deletePermission = asyncHandler(async (req, res) => {
    const permission = await Permission.findById(req.params.id)

    if(!permission) {
        res.status(400)
        throw new Error("Permission not find")
    }

    //await permission.deleteOne()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getPermissions,
    setPermission,
    updatePermission,
    deletePermission
}