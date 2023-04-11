import axios from "axios"

axios.interceptors.response.use((response) => {return response}, (error) => {
    if (error.response && error.response.status === 401) {
        console.log("401 error");
        window.location.href = "/logout"
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

const authService = {
    register,
    login,
    logout,
}

export default authService