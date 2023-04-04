import jwt_decode from "jwt-decode"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

const AuthVerify = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const {user} = useSelector((state) => state.auth);

    useEffect(() => {
        if(user && !user.token) {
            navigate("/logout")
        }
        if (user && user.token) {
            const decodedJwt = jwt_decode(user.token);

            if (decodedJwt.exp * 1000 < Date.now()) {
                navigate("/logout")
            }
        }
    }, [user, location, navigate])
}

export default AuthVerify;