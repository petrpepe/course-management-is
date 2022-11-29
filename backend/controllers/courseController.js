const asyncHandler = require('express-async-handler')

// @desc Get courses
// @route GET /api/coourses
// @access Private
const getCourse = asyncHandler(async (req, res) => {
    res.status(200).json({"message": "Get course"})
})

// @desc Create courses
// @route POST /api/coourses
// @access Private
const setCourse = asyncHandler(async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error("Please add text")
    }
    res.status(200).json({"message": "Set course"})
})

// @desc Update courses
// @route PUT /api/coourses/:id
// @access Private
const updateCourse = asyncHandler(async (req, res) => {
    res.status(200).json({"message": `Update course ${req.params.id}`})
})

// @desc Delete courses
// @route DELETE /api/coourses/:id
// @access Private
const deleteCourse = asyncHandler(async (req, res) => {
    res.status(200).json({"message": `Delete course ${req.params.id}`})
})

module.exports = {
    getCourse,
    setCourse,
    updateCourse,
    deleteCourse
}