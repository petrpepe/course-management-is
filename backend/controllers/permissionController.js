const asyncHandler = require('express-async-handler')
const Permisson = require('../models/permissionModel');

/**
 * @desc Get Permissons
 * @route GET /api/Permissons
 * @access Private
 */
const getPermissons = asyncHandler(async (req, res) => {
    const permissons = await Permisson.find()

    res.status(200).json(permissons)
})

/**
 * @desc Create permisson
 * @route POST /api/permisson
 * @access Private
 */
const setPermisson = asyncHandler(async (req, res) => {
    if(!req.body.name){
        res.status(400)
        throw new Error("Please add some name")
    }

    const permisson = await Permisson.create(req.body)

    res.status(200).json(permisson)
})

/**
 * @desc Update permisson by id
 * @route PUT /api/permissons/:id
 * @access Private
 */
const updatePermisson = asyncHandler(async (req, res) => {
    const permisson = await Permisson.findById(req.params.id)

    if(!permisson) {
        res.status(400)
        throw new Error("Permisson not find")
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
    const permisson = await Permisson.findById(req.params.id)

    if(!permisson) {
        res.status(400)
        throw new Error("Permisson not find")
    }

    await permisson.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getPermissons,
    setPermisson,
    updatePermisson,
    deletePermisson
}