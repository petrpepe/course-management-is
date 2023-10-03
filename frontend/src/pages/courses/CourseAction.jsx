import {useState, useEffect} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useLocation, useNavigate, useParams} from "react-router-dom"
import {toast} from "react-toastify"
import {FaChalkboard} from "react-icons/fa"
import {createCourse, updateCourse} from "../../features/courses/courseSlice"
import { getProviders } from "../../features/providers/providerSlice"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"

function CourseAction() {
  const [isCreate, setIsCreate] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    academicTerm: [],
    owner: "",
  })

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { id } = useParams()
  const user = useSelector((state) => state.auth)
  const course = useSelector((state) => state.courses.courses)

  useEffect(() => {

    setFormData({
      title: "",
      description: "",
      academicTerm: [],
      owner: "",
    })

  }, [user, id, navigate, dispatch])

  if(isCreate && course[0]) {
    setFormData({})
    navigate("/courses/" + course[0]._id)
  }

  const currentCourse = location.state ? location.state.currentCourse : formData
  if(id !== currentCourse._id) return <p>Ids are not equal</p>

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const courseData = {
      title: formData.title,
      description: formData.description,
      academicTerm: formData.academicTerm,
      owner: formData.owner,
    }

    if(id){
      courseData._id = id
      dispatch(updateCourse(courseData))
      setFormData({})
      navigate("/courses/" + id)
    } else {
      dispatch(createCourse(courseData))
      setIsCreate(true)
    }
  }

  return <>
      <section className="heading">
        <h1>
            <FaChalkboard /> {id ? "Editing course: " + currentCourse.title : "Create course"}
        </h1>
      </section>
      <section className="form">
        <form onSubmit={onSubmit} >
          <TextField id="title" name="title" label="Title" value={currentCourse.title} 
          onChange={(e) => onChange(e)} required={true} size="medium" fullWidth sx={{my: 1}} />
          <TextField id="description" name="description" label="Description" value={currentCourse.title} 
          onChange={(e) => onChange(e)} size="medium" fullWidth sx={{my: 1}} />
          <TextField id="academicTerm" name="academicTerm" label="Academic Term" value={currentCourse.title} 
          onChange={(e) => onChange(e)} size="medium" fullWidth sx={{my: 1}} />
          <Button type="submit" size="large" variant="contained" fullWidth sx={{my: 1}} >Submit</Button>
        </form>
      </section>
    </>
}

export default CourseAction