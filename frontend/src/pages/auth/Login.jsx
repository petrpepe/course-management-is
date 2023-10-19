import { useState, useEffect } from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate, useParams} from "react-router-dom"
import LoginIcon from '@mui/icons-material/Login'
import {login, forgotPassword} from "../../features/auth/authSlice"
import { Status } from "../../features/Status"
import { Alert, AlertTitle, Snackbar } from "@mui/material"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import CircularProgress from "@mui/material/CircularProgress"

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isForgotPassword, setforgotPassword] = useState(false)

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

    const userData = formData.email

    dispatch(forgotPassword(userData))
  }

  if (status === Status.Loading) {
    return <CircularProgress />
  }

  return (<Paper elevation={0} sx={{my: 5, mx: "auto", maxWidth: "1000px"}}>
    <Snackbar open autoHideDuration={1000} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <Alert severity="error" sx={{textAlign: "left"}} >
        <AlertTitle><strong>Error</strong></AlertTitle>
          This is an error alert
      </Alert>
    </Snackbar>
    <Typography variant="h2">
      <LoginIcon fontSize="large" /> {isForgotPassword ? "Forgot password?" : "Login"}
    </Typography>
    <Typography variant="subtitle1">
      {isForgotPassword ? "Write your email and check your mailbox" : "Please sign in"}
    </Typography>
    <form onSubmit={isForgotPassword ? onSubmitForgotPassword : onSubmitLogin}>
      <TextField id="email" name="email" label="Your email" type="email" value={formData.email} 
      onChange={onChange} required={true} size="medium" fullWidth sx={{my: 1}} />
      {isForgotPassword ? "" :
        <TextField id="password" name="password" label="Enter your password" type="password" value={formData.password} 
        onChange={onChange} required={true} size="medium" fullWidth sx={{my: 1}} />
      }
      <Button variant="text" onClick={() => setforgotPassword(!isForgotPassword)}>{isForgotPassword ? "Back to login" : "Forgot password?"}</Button>
      <Button type="submit" size="large" variant="outlined" fullWidth sx={{my: 1}}>{isForgotPassword ? "Send " : "Submit"}</Button>
    </form>
  </Paper>)
}

export default Login