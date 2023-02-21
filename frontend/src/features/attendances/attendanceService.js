import axios from "axios"

const API_URL = "/api/attendances/"

const createAttendance = async (attendanceData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, attendanceData, config)

    return response.data
}

const getAttendances = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config)

    return response.data
}

const deleteAttendance = async (attendanceId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + attendanceId, config)

    return response.data
}

const attendanceService = {
    createAttendance,
    getAttendances,
    deleteAttendance,
}

export default attendanceService