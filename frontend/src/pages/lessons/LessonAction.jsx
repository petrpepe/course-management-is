import {useEffect, useState} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useLocation, useNavigate, useParams} from "react-router-dom"
import {FaChalkboard} from "react-icons/fa"
import {createLesson, getLessons, reset, updateLesson} from "../../features/lessons/lessonSlice"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import CustomSelect from "../../components/form/CustomSelect"
import { getCourses } from "../../features/courses/courseSlice"

function LessonAction() {
  const [isCreate, setIsCreate] = useState(false)
  const [formData, setFormData] = useState({
    lessonNum: 1,
    title: "",
    description: "",
    materials: "",
    duration: 60,
    course: "",
  })

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { id } = useParams()
  const lesson = useSelector((state) => state.lessons.lessons).filter(l =>  l._id === id)
  const courses = useSelector((state) => state.courses)
  const currentLesson = location.state ? location.state.currentLesson : formData

  useEffect(() => {

    if(!lesson && currentLesson) getLessons(id)

    return () => {
      dispatch(reset())
    }
  }, [lesson, currentLesson, id, navigate, dispatch])

  if(isCreate && lesson[0]) {
    setFormData({})
    navigate("/lessons/" + lesson[0]._id)
  }

  if (location.state && formData.title === "") {
    for (const key in currentLesson) {
      if (Object.hasOwnProperty.call(currentLesson, key)) {
        formData[key] = currentLesson[key];
      }
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const lessonData = {
      lessonNum: formData.lessonNum,
      title: formData.title,
      description: formData.description,
      materials: formData.materials,
      duration: formData.duration,
    }

    if(id){
      lessonData._id = id
      dispatch(updateLesson(lessonData))
      setFormData({})
      navigate("/lessons/" + id)
    } else {
      dispatch(createLesson(lessonData))
      setIsCreate(true)
    }
  }

  return <>
      <section className="heading">
        <h1>
            <FaChalkboard /> {id ? "Editing lesson: " + currentLesson.title : "Create lesson"}
        </h1>
      </section>
      <section className="form">
        <form onSubmit={onSubmit}>
          <TextField  id="lessonNum" label="lessonNum:" value={currentLesson.lessonNum} 
          type="number" onChange={(e) => onChange(e)} required={true} min={1} size="medium" fullWidth sx={{my: 1}} />
          <TextField  id="title" label="Title:" value={currentLesson.title} 
          placeholder="Enter title" onChange={(e) => onChange(e)} required={true} size="medium" fullWidth sx={{my: 1}} />
          <TextField  id="description" label="Description:" value={currentLesson.description} 
          placeholder="Enter description" onChange={(e) => onChange(e)} size="medium" fullWidth sx={{my: 1}} />
          <TextField  id="materials" label="Materials:" value={currentLesson.materials} 
          placeholder="Enter materials" onChange={(e) => onChange(e)} size="medium" fullWidth sx={{my: 1}} />
          <TextField  id="duration" label="Duration:" value={currentLesson.duration} 
          min={1} onChange={(e) => onChange(e)} type="number" size="medium" fullWidth sx={{my: 1}} />
          <CustomSelect id="course" label="Select course" items={courses.courses} getItems={getCourses} itemsStatus={courses.status}
          formData={formData} setFormData={setFormData} multiple={false} />
          <Button type="submit" size="large" variant="outlined" fullWidth sx={{my: 1}} >Submit</Button>
        </form>
      </section>
    </>
}

export default LessonAction