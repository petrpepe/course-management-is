import {useState} from "react"
import {useDispatch} from 'react-redux'
import {useNavigate, useParams} from "react-router-dom"
import {FaChalkboard} from "react-icons/fa"
import {createCourse, getCourses, updateCourse, reset as resetCourses} from "../../features/courses/courseSlice"
import { getProviders, reset as resetProviders } from "../../features/providers/providerSlice"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import CustomSelect from "../../components/form/CustomSelect"
import useGetData from "../../hooks/useGetData"
import Typography from "@mui/material/Typography"

function CourseAction() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    academicTerm: [],
    owner: "",
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { id } = useParams()
  const courses = useGetData("courses", getCourses, resetCourses)
  const providers = useGetData("providers", getProviders, resetProviders)
  let currentCourse = id ? courses.filter(c => c._id === id) : formData

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if(id){
      formData._id = id
      dispatch(updateCourse(formData))
      setFormData({})
      navigate("/courses/" + id)
    } else {
      dispatch(createCourse(formData))
      navigate("/courses/" + courses[courses.length - 1]._id)
    }
  }

  return <>
    <section className="heading">
      <Typography variant="h2">
          <FaChalkboard /> {id ? "Editing course: " + currentCourse.title : "Create course"}
      </Typography>
    </section>
    <section className="form">
      <form onSubmit={onSubmit} >
        <TextField id="title" name="title" label="Title" value={currentCourse.title} 
        onChange={(e) => onChange(e)} required={true} size="medium" fullWidth sx={{my: 1}} />
        <TextField id="description" name="description" label="Description" value={currentCourse.description} 
        onChange={(e) => onChange(e)} size="medium" fullWidth sx={{my: 1}} />
        <TextField id="academicTerm" name="academicTerm" label="Academic Term" value={currentCourse.academicTerm} 
        onChange={(e) => onChange(e)} size="medium" fullWidth sx={{my: 1}} />
        <CustomSelect id="owner" label="Select owner" items={providers.providers.map(p => {return {_id: p._id, title: p.name}})} getItems={getProviders} itemsStatus={providers.status}
        formData={formData} setFormData={setFormData} multiple={false} />
        <Button type="submit" size="large" variant="outlined" fullWidth sx={{my: 1}} >Submit</Button>
      </form>
    </section>
  </>
}

export default CourseAction