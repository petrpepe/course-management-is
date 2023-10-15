import {useState, useEffect} from "react"
import {useDispatch} from 'react-redux'
import {useNavigate, useParams} from "react-router-dom"
import SchoolIcon from '@mui/icons-material/School'
import {createLesson, getLessons, updateLesson, reset as resetLessons} from "../../features/lessons/lessonSlice"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import CustomSelect from "../../components/form/CustomSelect"
import { getCourses, reset as resetCourses } from "../../features/courses/courseSlice"
import Typography from "@mui/material/Typography"
import useGetData from "../../hooks/useGetData"
import CircularProgress from "@mui/material/CircularProgress"
import { Status } from "../../features/Status"

function LessonAction() {
  const [isCreated, setIsCreated] = useState(false)
  const [formData, setFormData] = useState({
    lessonNum: 1,
    title: "",
    description: "",
    materials: "",
    duration: 60,
    course: "",
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { id } = useParams()
  const lessons = useGetData("lessons", getLessons, resetLessons, id, true)
  const courses = useGetData("courses", getCourses, resetCourses)

  useEffect(() => {
    if(id && lessons.status === Status.Success) setFormData(lessons.lessons.filter(l => l._id === id)[0])
  }, [id, lessons.status, lessons.lessons])

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
      dispatch(updateLesson(formData))
      setFormData({})
      navigate("/lessons/" + id)
    } else {
      dispatch(createLesson(formData))
      setIsCreated(true)
    }
  }

  if (isCreated && lessons.status === Status.Success) {
    navigate("/lessons/" + lessons.lessons[lessons.lessons.length-1]._id)
  }

  if(lessons.status === Status.Loading || courses.status === Status.Idle) {
    return <CircularProgress />
  }

  return <>
      <section className="heading">
        <Typography variant="h2">
            <SchoolIcon fontSize="large" /> {id ? "Editing lesson: " + formData.title : "Create lesson"}
        </Typography>
      </section>
      <section className="form">
        <form onSubmit={onSubmit}>
          <TextField  id="lessonNum" name="lessonNum" label="lessonNum:" value={formData.lessonNum} type="number" 
          onChange={(e) => onChange(e)} required={true} InputProps={{ inputProps: { min: 1 } }} size="medium" fullWidth sx={{my: 1}} />
          <TextField  id="title" name="title" label="Title:" value={formData.title} 
          placeholder="Enter title" onChange={(e) => onChange(e)} required={true} size="medium" fullWidth sx={{my: 1}} />
          <TextField  id="description" name="description" label="Description:" value={formData.description} 
          placeholder="Enter description" onChange={(e) => onChange(e)} size="medium" fullWidth sx={{my: 1}} />
          <TextField  id="materials" name="materials" label="Materials:" value={formData.materials} 
          placeholder="Enter materials" onChange={(e) => onChange(e)} size="medium" fullWidth sx={{my: 1}} />
          <TextField  id="duration" name="duration" label="Duration:" value={formData.duration} type="number"
          InputProps={{ inputProps: { min: 1 } }}onChange={(e) => onChange(e)} size="medium" fullWidth sx={{my: 1}} />
          <CustomSelect id="course" label="Select course" items={courses.courses.map(c => {return {_id: c._id, title: c.title}})} getItems={getCourses} itemsStatus={courses.status}
          formData={formData} setFormData={setFormData} multiple={false} selectedItems={formData.course} />
          <Button type="submit" size="large" variant="outlined" fullWidth sx={{my: 1}} >Submit</Button>
        </form>
      </section>
    </>
}

export default LessonAction