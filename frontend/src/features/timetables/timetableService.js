import axios from "axios"

const API_URL = "/api/timetables/"

const createTimetable = async (timetableData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, timetableData, config)

    return response.data
}

const updateTimetable = async (timetableId, timetableData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    delete timetableData._id
    const response = await axios.put(API_URL + timetableId, timetableData, config)

    return response.data
}

const getTimetables = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config)

    return response.data
}

const deleteTimetable = async (timetableId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + timetableId, config)

    return response.data
}

const timetableService = {
    createTimetable,
    updateTimetable,
    getTimetables,
    deleteTimetable,
}

export default timetableService