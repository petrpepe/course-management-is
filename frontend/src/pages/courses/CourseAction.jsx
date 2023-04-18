import {useState, useEffect} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useLocation, useNavigate, useParams} from "react-router-dom"
import {toast} from "react-toastify"
import {FaChalkboard} from "react-icons/fa"
import {createCourse, updateCourse} from "../../features/courses/courseSlice"
import { getLessons, reset as lessonsReset } from "../../features/lessons/lessonSlice"
import Input from "../../components/form/Input"
import Select from 'react-select'

function CourseAction() {
  const [isCreate, setIsCreate] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    lessons: [],
    place: "",
  })

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { id } = useParams()
  const user = useSelector((state) => state.auth)
  const lessons = useSelector((state) => state.lessons)
  const course = useSelector((state) => state.courses.courses)

  useEffect(() => {
    if(lessons.isError) {
      toast.error(lessons.message)
    }

    if(!user) {
      navigate("/")
      return
    }

    dispatch(getLessons())

    setFormData({
      title: "",
      description: "",
      lessons: [],
      place: "",
    })

    return () => {
      dispatch(lessonsReset())
    }
  }, [user, id, navigate, lessons.isError, lessons.message, dispatch])

  if(isCreate && course[0]) {
    navigate("/courses/" + course[0]._id)
  }

  const currentCourse = location.state ? location.state.currentCourse : formData
  if(id !== currentCourse._id) return <p>Ids are not equal</p>

  if (location.state && formData.title === "") {
    for (const key in currentCourse) {
      if (Object.hasOwnProperty.call(currentCourse, key)) {
        formData[key] = currentCourse[key];
      }
    }
    formData.lessons = formData.lessons.map(l => l.lesson)
  }

  const lessonOptions = lessons.lessons.map((lesson) => {
    if (formData.lessons.length > 0 && formData.lessons.includes(lesson._id)) {
      return {value: lesson._id, label: lesson.title, isSelected: true}
    } else return {value: lesson._id, label: lesson.title, isSelected: false}
  })

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSelectChange = (e, a) => {
    const selectName = a.name
    let selectedOptionsValues = []

    for (let index = 0; index < e.length; index++) {
      selectedOptionsValues[index] = e[index].value
    }

    setFormData({
      ...formData,
      [selectName]: selectedOptionsValues,
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()

    let lessonsForm = []
    for (let i = 0; i < formData.lessons.length; i++) {
      const element = formData.lessons[i];
      lessonsForm.push({lesson: element, orderNumber: i + 1})
    }

    const courseData = {
      title: formData.title,
      description: formData.description,
      lessons: lessonsForm,
      place: formData.place,
    }

    if(id){
      courseData._id = id
      dispatch(updateCourse(courseData))
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
        <form onSubmit={onSubmit}>
          <Input  id="title" label="Title:" value={currentCourse.title} 
          placeholder="Enter title" onChange={onChange} required={true} />
          <Input  id="description" label="Description:" value={currentCourse.description} 
          placeholder="Enter description" onChange={onChange} />
          <div className="form-group ">
            <label htmlFor="lessons">Select lessons:</label>
            <Select id="lessons" name="lessons" options={lessonOptions} value={lessonOptions.filter((lesson) => lesson.isSelected)} onChange={onSelectChange} isMulti isSearchable isClearable />
          </div>
          <Input  id="place" label="Place of happening:" value={currentCourse.place} 
          placeholder="Enter place or online (URL)" onChange={onChange} />
          <div className="form-group">
            <button type="submit" className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
}

export default CourseAction