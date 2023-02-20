const asyncHandler = require('express-async-handler')
const Permisson = require('../models/permissionModel');

// @desc Get Permissons
// @route GET /api/Permissons
// @access Private
const getPermissons = asyncHandler(async (req, res) => {
    const Permissons = await Permisson.find()

    res.status(200).json(Permissons)
})

// @desc Get Permisson by id
// @route GET /api/Permissons
// @access Private
const getPermissonById = asyncHandler(async (req, res) => {
    const Permissons = await Permisson.findById(req.params.id)

    res.status(200).json(Permissons)
})

// @desc Create permisson
// @route POST /api/permisson
// @access Private
const setPermisson = asyncHandler(async (req, res) => {
    if(!req.body.name){
        res.status(400)
        throw new Error("Please add text")
    }

    const permisson = await Permisson.create({
        name: req.body.name,
        description: req.body.description,
        permissions: req.body.permissions,
    })

    res.status(200).json(permisson)
})

/**
 * @desc Update permisson by id
 * @route PUT /api/permissons/:id
 * @access Private
 */
const updatePermisson = asyncHandler(async (req, res) => {
    const Permisson = await Permisson.findById(req.params.id)

    if(!Permisson) {
        res.status(400)
        throw new Error("Permisson not find")
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    const updatedPermisson = await Permisson.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedPermisson)
})

/**
 * @desc Delete permisson by id
 * @route DELETE /api/permissons/:id
 * @access Private
 */
const deletePermisson = asyncHandler(async (req, res) => {
    const Permisson = await Permisson.findById(req.params.id)

    if(!Permisson) {
        res.status(400)
        throw new Error("Permisson not find")
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if(Permisson.user.toString() != req.user.id) {
        res.status(403)
        throw new Error("User not authorized")
    }

    await Permisson.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getPermissons,
    getPermissonById,
    setPermisson,
    updatePermisson,
    deletePermisson
}