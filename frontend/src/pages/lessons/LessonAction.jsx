import {useEffect, useState} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useLocation, useNavigate, useParams} from "react-router-dom"
import {FaChalkboard} from "react-icons/fa"
import {createLesson, reset, updateLesson} from "../../features/lessons/lessonSlice"
import Input from "../../components/form/Input"

function LessonAction() {
  const [formData, setFormData] = useState({
    lessonNum: 1,
    title: "",
    description: "",
    materials: "",
  })

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { id } = useParams()
  const user = useSelector((state) => state.auth)
  const lesson = useSelector((state) => state.lessons.lessons[0])

  useEffect(() => {
    if(!user) {
      navigate("/")
      return
    }

    setFormData({
      lessonNum: 1,
      title: "",
      description: "",
      materials: "",
    })

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, dispatch])

  if(!id && lesson._id) {
    navigate("/lessons/" + lesson._id)
  }

  const currentLesson = location.state ? location.state.currentLesson : formData
  if(id !== currentLesson._id) return <p>Ids are not equal</p>

  if (location.state && formData.title === "") {
    for (const key in currentLesson) {
      if (Object.hasOwnProperty.call(currentLesson, key)) {
        formData[key] = currentLesson[key];
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

  const onSubmit = (e) => {
    e.preventDefault()

    const lessonData = {
      lessonNum: formData.lessonNum,
      title: formData.title,
      description: formData.description,
      materials: formData.materials,
    }

    if(id){
      lessonData._id = id
      dispatch(updateLesson(lessonData))
      navigate("/lessons/" + id)
    } else {
      dispatch(createLesson(lessonData))
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
          <Input  id="lessonNum" label="lessonNum:" value={currentLesson.lessonNum} 
          type="number" onChange={onChange} required={true} min={1} />
          <Input  id="title" label="Title:" value={currentLesson.title} 
          placeholder="Enter title" onChange={onChange} required={true} />
          <Input  id="description" label="Description:" value={currentLesson.description} 
          placeholder="Enter description" onChange={onChange} />
          <Input  id="materials" label="Materials:" value={currentLesson.materials} 
          placeholder="Enter materials" onChange={onChange} />
          <div className="form-group">
            <button type="submit" className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
}

export default LessonAction