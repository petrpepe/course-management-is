import { useState, useEffect } from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify"
import { FaSignInAlt } from "react-icons/fa"
import {login, forgotPassword, reset} from "../features/auth/authSlice"
import Spinner from "../components/Spinner"

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isForgotPassword, setforgotPassword] = useState(false)

  const {email, password} = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

  useEffect(() => {
    if(isError) {
      toast.error(message)
    }

    if(isSuccess || user) {
      navigate("/")
    }

    dispatch(reset())

  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
    }))
  }
  const onSubmitLogin = (e) => {
    e.preventDefault()

    const userData = {
        email,
        password,
    }

    dispatch(login(userData))
  }

  const onSubmitForgotPassword = (e) => {
    e.preventDefault()

    const userData = {
        email
    }

    dispatch(forgotPassword(userData))
  }

  if (isLoading) {
    return <Spinner />
  }

  return <>
    <section className="heading">
        <h1>
            <FaSignInAlt /> {isForgotPassword ? "Forgot password?" : "Login"}
        </h1>
        <p>{isForgotPassword ? "Write your email and check your mailbox" : "Please sign in"}</p>
    </section>
    <section className="form">
        <form onSubmit={isForgotPassword ? onSubmitForgotPassword : onSubmitLogin}>
            <div className="form-group" >
                <input type="email" className="form-control" name="email" id="email"
                value={email} placeholder="Enter your email" onChange={onChange} required />
            </div>
            {isForgotPassword ? "" :
            <div className="form-group" >
                <input type="password" className="form-control" name="password" id="password"
                value={password} placeholder="Enter your password" onChange={onChange} required />
            </div>}
            <div className="form-group">
                <span onClick={() => setforgotPassword(!isForgotPassword)}>{isForgotPassword ? "Back to login" : "Forgot password?"}</span>
            </div>
            <div className="form-group">
                <button type="submit" className="btn btn-block">{isForgotPassword ? "Send " : "Submit"}</button>
            </div>
        </form>
    </section>
    </>
}

export default Login