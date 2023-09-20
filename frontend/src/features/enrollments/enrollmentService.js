import axios from "axios"

const API_URL = "/api/enrollments/"

const createEnrollment = async (enrollmentData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, enrollmentData, config)

    return response.data
}

const updateEnrollment = async (enrollmentId, enrollmentData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    delete enrollmentData._id
    const response = await axios.put(API_URL + enrollmentId, enrollmentData, config)

    return response.data
}

const getEnrollments = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config)

    return response.data
}

const deleteEnrollment = async (enrollmentId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + enrollmentId, config)

    return response.data
}

const enrollmentService = {
    createEnrollment,
    updateEnrollment,
    getEnrollments,
    deleteEnrollment,
}

export default enrollmentService