import axios from "axios"

axios.interceptors.response.use((response) => {return response}, (error) => {
    if (error.response && error.response.status === 401) {
        console.error("401 unathorized");
        //window.location.href = "/logout"
    }

    return Promise.reject(error)
})

const API_URL = "/api/users/"

const register = async (userData) => {
    const response = await axios.post(API_URL, userData)

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }

    return response.data
}

const login = async (userData) => {
    const response = await axios.post(API_URL + "login", userData)

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }

    return response.data
}

const logout = () => {
    localStorage.removeItem("user")
}

const forgotPassword = async (userData) => {
    const response = await axios.post(API_URL + "forgotPassword", userData)

    return response.data
}

const setNewPassword = async (userData) => {
    const response = await axios.post(API_URL + "setNewPassword", userData)

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }

    return response.data
}

const authService = {
    register,
    login,
    logout,
    forgotPassword,
    setNewPassword,
}

export default authService