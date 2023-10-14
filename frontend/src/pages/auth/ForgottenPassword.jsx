import { useState, useEffect } from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate, useParams} from "react-router-dom"
import { FaKey } from "react-icons/fa"
import {setNewPassword, reset} from "../../features/auth/authSlice"
import Spinner from "../../components/Spinner"
import { Status } from "../../features/Status"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"

function ForgottenPassword() {
  const [formData, setFormData] = useState({
    password: "",
    password1: "",
  })

  const {password, password1} = formData

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {userId} = useParams()

  const {user, status, message} = useSelector((state) => state.auth)

  useEffect(() => {
    if(status === Status.Success || user) {
      navigate("/")
    }

    dispatch(reset())
  }, [user, status, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const userData = {
        userId,
        password,
        password1,
    }

    dispatch(setNewPassword(userData))
  }

  if (status === Status.Loading) {
    return <Spinner />
  }

  return <>
    <section className="heading">
      <Typography variant="h2"><FaKey /> Set new password</Typography>
    </section>
    <section className="form">
      <form onSubmit={onSubmit}>
        <TextField id="password" name="password" label="Enter your password" type="password" value={password} 
          onChange={onChange} required={true} size="medium" fullWidth sx={{my: 1}} />
        <TextField id="password1" name="password1" label="Enter your password" type="password" value={password1} 
          onChange={onChange} required={true} size="medium" fullWidth sx={{my: 1}} />
        <Button type="submit" size="large" variant="outlined" fullWidth sx={{my: 1}}>Set new password</Button>
      </form>
    </section>
  </>
}

export default ForgottenPassword