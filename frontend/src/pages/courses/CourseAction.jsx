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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    numLessons: 0,
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

    if(user._id !== id || user.roles.includes("admin")) {
      dispatch(getLessons())
    }

    setFormData({
      title: "",
      description: "",
      numLessons: 0,
      lessons: [],
      place: "",
    })

    return () => {
      dispatch(lessonsReset())
    }
  }, [user, id, navigate, lessons.isError, lessons.message, dispatch])

  if(!id && course._id) {
    navigate("/courses/" + course._id)
  }

  const currentCourse = location.state ? location.state.currentCourse : formData
  if(id !== currentCourse._id) return <p>Ids are not equal</p>

  const lessonOptions = lessons.lessons.map((lesson) => {
    if (formData.lessons && (formData.lessons.includes(lesson._id) || formData.roles.includes(lesson.name))) {
      return {value: lesson._id, label: lesson.title, isSelected: true}
    } else return {value: lesson._id, label: lesson.title, isSelected: false}
  }).filter(lesson => lesson != null)

  if (location.state && formData.title === "") {
    for (const key in currentCourse) {
      if (Object.hasOwnProperty.call(currentCourse, key)) {
        formData[key] = currentCourse[key];
      }
    }
  }

  const onChange = (e) => {
    if (e.target.name.includes(".")) {
      const keys = e.target.name.split(".")
        setFormData((prevState) => ({
          ...prevState,
          [keys[0]]: {
            [keys[1]]: e.target.value
          },
        }))
    } else {
      setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
      }))
    }
  }

  const onSelectChange = (e, a) => {
    const selectName = a.name
    let selectedOptionsValues = e.map((opt) => (opt.value))

    setFormData({
      ...formData,
      [selectName]: selectedOptionsValues,
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const courseData = {
      title: formData.title,
      description: formData.description,
      numLessons: formData.numLessons,
      lessons: formData.lessons,
      place: formData.place,
    }

    if(id){
      courseData._id = id
      dispatch(updateCourse(courseData))
      navigate("/courses/" + id)
    } else {
      dispatch(createCourse(courseData))
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
          <Input  id="numLessons" label="Number of lessons:" value={currentCourse.numLessons} 
          type="number" onChange={onChange} min={0} />
          <div className="form-group ">
            <label htmlFor="lessons">Select lessons:</label>
            <Select id="lessons" name="lessons" options={lessonOptions} defaultValue={lessonOptions.filter((lesson) => lesson.isSelected)} onChange={onSelectChange} isMulti isSearchable isClearable />
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