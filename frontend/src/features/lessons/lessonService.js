import axios from "axios"

const API_URL = "/api/lessons/"

const createLesson = async (lessonData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, lessonData, config)

    return response.data
}

const getLessons = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config)

    return response.data
}

const deleteLesson = async (lessonId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + lessonId, config)

    return response.data
}

const lessonService = {
    createLesson,
    getLessons,
    deleteLesson,
}

export default lessonService