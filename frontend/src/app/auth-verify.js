import jwt_decode from "jwt-decode"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const AuthVerify = () => {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            const decodedJwt = jwt_decode(user.token);

            if (decodedJwt.exp * 1000 < Date.now()) {
                navigate("/logout")
            }
        }
    }, [location, navigate])
}

export default AuthVerify;