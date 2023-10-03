const asyncHandler = require('express-async-handler')
const Provider = require('../models/providerModel')
const User = require('../models/userModel')

/**
 * @desc Get Providers
 * @route GET /api/Providers
 * @access Private
 */
const getProviders = asyncHandler(async (req, res) => {
    const Providers = await Provider.find()

    res.status(200).json(Providers)
})

/**
 * @desc Create provider
 * @route POST /api/provider
 * @access Private
 */
const setProvider = asyncHandler(async (req, res) => {
    if(!req.body.name){
        res.status(400)
        throw new Error("Please add text")
    }

    const provider = await Provider.create(req.body)

    res.status(200).json(provider)
})

/**
 * @desc Update provider by id
 * @route PUT /api/providers/:id
 * @access Private
 */
const updateProvider = asyncHandler(async (req, res) => {
    const provider = await Provider.findById(req.params.id)

    if(!provider) {
        res.status(400)
        throw new Error("Provider not find")
    }

    const updatedProvider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedProvider)
})

/**
 * @desc Delete provider by id
 * @route DELETE /api/providers/:id
 * @access Private
 */
const deleteProvider = asyncHandler(async (req, res) => {
    const provider = await Provider.findById(req.params.id)

    if(!provider) {
        res.status(400)
        throw new Error("Provider not find")
    }

    await provider.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getProviders,
    setProvider,
    updateProvider,
    deleteProvider
}