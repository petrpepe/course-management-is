import { useState, useEffect } from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate, useParams} from "react-router-dom"
import { FaKey } from "react-icons/fa"
import {setNewPassword, reset} from "../../features/auth/authSlice"
import Spinner from "../../components/Spinner"
import Input from "../../components/form/Input"
import { Status } from "../../features/Status"

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
        <h1><FaKey /> Set new password</h1>
    </section>
    <section className="form">
        <form onSubmit={onSubmit}>
            <div className="form-group" >
                <Input type="password" id="password" value={password}
                placeholder="Enter your password" onChange={onChange} required />
            </div>
            <div className="form-group" >
                <Input type="password" id="password1" value={password1} 
                placeholder="Repeat your password" onChange={onChange} required />
            </div>
            <div className="form-group">
                <button type="submit" className="btn btn-block">Set new password</button>
            </div>
        </form>
    </section>
  </>
}

export default ForgottenPassword