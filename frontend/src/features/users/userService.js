import axios from "axios"

const API_URL = "/api/users/"

const createUser = async (userData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, userData, config)

    return response.data
}

const getUsers = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + "all", config)

    return response.data
}

const deleteUser = async (userId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + userId, config)

    return response.data
}

const userService = {
    createUser,
    getUsers,
    deleteUser,
}

export default userService