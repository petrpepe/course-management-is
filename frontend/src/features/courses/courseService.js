import axios from "axios"

const API_URL = "/api/courses/"

const getCourses = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config)

    return response.data
}

const getCourseById = async (courseId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + courseId, config)

    return response.data
}

const createCourse = async (courseData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, courseData, config)
    console.log(response);

    return response.data
}

const updateCourse = async (courseId, courseData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + courseId, courseData, config)

    return response.data
}

const deleteCourse = async (courseId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + courseId, config)

    return response.data
}

const courseService = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
}

export default courseService