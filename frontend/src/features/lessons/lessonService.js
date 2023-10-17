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

const updateLesson = async (lessonId, lessonData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + lessonId, lessonData, config)

    return response.data
}

const getLessons = async (ids, detail, keyword, courseId, token) => {
    let params = new URLSearchParams()
    if(ids) typeof ids === "string" ? params.append("id", ids) : ids.map((id) => params.append("id", id))
    params.append("detail", detail)
    if(keyword) params.append("keyword", keyword)
    if(courseId) params.append("courseId", courseId)
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: params
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
    updateLesson,
    getLessons,
    deleteLesson,
}

export default lessonService