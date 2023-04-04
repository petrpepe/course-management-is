import axios from "axios"

const API_URL = "/api/permissions/"

const createPermission = async (permissionData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, permissionData, config)

    return response.data
}

const updatePermission = async (permissionId, permissionData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + permissionId, permissionData, config)

    return response.data
}


const getPermissions = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config)

    return response.data
}

const deletePermission = async (permissionId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + permissionId, config)

    return response.data
}

const permissionService = {
    createPermission,
    updatePermission,
    getPermissions,
    deletePermission,
}

export default permissionService