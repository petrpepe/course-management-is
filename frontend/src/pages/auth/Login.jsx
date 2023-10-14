import { useState, useEffect } from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate, useParams} from "react-router-dom"
import { FaSignInAlt } from "react-icons/fa"
import {login, forgotPassword} from "../../features/auth/authSlice"
import Spinner from "../../components/Spinner"
import { Status } from "../../features/Status"
import { Alert, AlertTitle, Snackbar } from "@mui/material"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isForgotPassword, setforgotPassword] = useState(false)

  const {email, password} = formData

  const {userEmail} = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user, status, message} = useSelector((state) => state.auth)

  useEffect(() => {
    if(status === Status.Success || user) {
      navigate("/")
    }

    if (userEmail && !isForgotPassword) {
      setforgotPassword(true);
      setFormData(() => ({
        email: userEmail
      }))
    }
  }, [user, status, message, userEmail, isForgotPassword, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
    }))
  }
  const onSubmitLogin = (e) => {
    e.preventDefault()

    dispatch(login(formData))
  }

  const onSubmitForgotPassword = (e) => {
    e.preventDefault()

    const userData = {
      email
    }

    dispatch(forgotPassword(userData))
  }

  if (status === Status.Loading) {
    return <Spinner />
  }

  return <>
    <Snackbar open autoHideDuration={1000} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <Alert severity="error" sx={{textAlign: "left"}} >
        <AlertTitle><strong>Error</strong></AlertTitle>
          This is an error alert
      </Alert>
    </Snackbar>
    <section className="heading">
      <Typography variant="h2">
        <FaSignInAlt /> {isForgotPassword ? "Forgot password?" : "Login"}
      </Typography>
      <Typography variant="subtitle1">
        {isForgotPassword ? "Write your email and check your mailbox" : "Please sign in"}
      </Typography>
    </section>
    <section className="form">
      <form onSubmit={isForgotPassword ? onSubmitForgotPassword : onSubmitLogin}>
        <TextField id="email" name="email" label="Your email" type="email" value={email} 
        onChange={onChange} required={true} size="medium" fullWidth sx={{my: 1}} />
        {isForgotPassword ? "" :
          <TextField id="password" name="password" label="Enter your password" type="password" value={password} 
          onChange={onChange} required={true} size="medium" fullWidth sx={{my: 1}} />
        }
        <Button variant="text" onClick={() => setforgotPassword(!isForgotPassword)}>{isForgotPassword ? "Back to login" : "Forgot password?"}</Button>
        <Button type="submit" size="large" variant="outlined" fullWidth sx={{my: 1}}>{isForgotPassword ? "Send " : "Submit"}</Button>
      </form>
    </section>
  </>
}

export default Login