import { useState, useEffect } from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify"
import {FaRegEnvelope } from "react-icons/fa"
import Spinner from "../components/Spinner"
import {sendEmail} from "../features/email/emailSlice"

function EmailPage() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    replyTo: "",
    subject: "",
    content: "",
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

  useEffect(() => {
    if(isError) {
      toast.error(message)
    }

    if(!user) {
      navigate("/")
    }
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
    }))
  }
  const onSubmit = (e) => {
    e.preventDefault()

    const options = {
      ...formData
    }

    dispatch(sendEmail(options))
  }

  if (isLoading) {
    return <Spinner />
  }

  return <>
      <section className="heading">
        <h1>
            <FaRegEnvelope /> Send Emails to classes or students
        </h1>
        <p>It can be whoever</p>
      </section>
      <section className="form">
        <form onSubmit={onSubmit}>
            <div className="form-group" >
                <input type="email" className="form-control" name="from" id="from"
                value={formData.from} placeholder="Enter email you want to send it from" onChange={onChange} />
            </div>
            <div className="form-group" >
                <input type="email" className="form-control" name="to" id="to"
                value={formData.to} placeholder="Enter recepiens" onChange={onChange} required />
            </div>
            <div className="form-group" >
                <input type="email" className="form-control" name="replyTo" id="replyTo"
                value={formData.replyTo} placeholder="Enter email you want people reply to" onChange={onChange} />
            </div>
            <div className="form-group" >
                <input type="text" className="form-control" name="subject" id="subject"
                value={formData.subject} placeholder="Enter subject" onChange={onChange} required />
            </div>
            <div className="form-group" >
                <textarea type="text" className="form-control" name="content" id="content"
                value={formData.content} placeholder="Enter content of email" onChange={onChange} />
            </div>
            <div className="form-group">
                <button type="submit" className="btn btn-block">Submit</button>
            </div>
        </form>
      </section>
    </>
}

export default EmailPage