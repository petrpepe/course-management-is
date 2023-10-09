import {useState, useEffect} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useLocation, useNavigate, useParams} from "react-router-dom"
import {FaChalkboard} from "react-icons/fa"
import {createCourse, getCourses, updateCourse} from "../../features/courses/courseSlice"
import { getProviders } from "../../features/providers/providerSlice"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import CustomSelect from "../../components/form/CustomSelect"

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
  const course = useSelector((state) => state.courses.courses).filter(c => c._id === id)
  const provider = useSelector((state) => state.providers)
  let currentCourse = location.state ? location.state.data : course
  if (!currentCourse._id) currentCourse = formData

  useEffect(() => {
    if(id !== currentCourse._id) getCourses(id)
  }, [id, currentCourse._id, navigate, dispatch])

  if(isCreate && course[0]) {
    setFormData({})
    navigate("/courses/" + course[0]._id)
  }

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
          <TextField id="description" name="description" label="Description" value={currentCourse.description} 
          onChange={(e) => onChange(e)} size="medium" fullWidth sx={{my: 1}} />
          <TextField id="academicTerm" name="academicTerm" label="Academic Term" value={currentCourse.academicTerm} 
          onChange={(e) => onChange(e)} size="medium" fullWidth sx={{my: 1}} />
          <CustomSelect id="provider" label="Select owner" items={provider.providers.map(p => {return {_id: p._id, title: p.name}})} getItems={getProviders} itemsStatus={provider.status}
          formData={formData} setFormData={setFormData} multiple={false} />
          <Button type="submit" size="large" variant="outlined" fullWidth sx={{my: 1}} >Submit</Button>
        </form>
      </section>
    </>
}

export default CourseAction