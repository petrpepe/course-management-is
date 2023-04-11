import {useState, useEffect} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useLocation, useNavigate, useParams} from "react-router-dom"
import {toast} from "react-toastify"
import {FaChalkboardTeacher} from "react-icons/fa"
import {createClass, updateClass} from "../../features/classes/classSlice"
import {getUsers, reset as userReset} from "../../features/users/userSlice"
import {getCourses, reset as courseReset} from "../../features/courses/courseSlice"
import Input from "../../components/form/Input"
import Select from 'react-select'
import Spinner from "../../components/Spinner"

function ClassAction() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDateTime: "",
    repeatDay: {
        day: 0,
        time: "",
        count: 0,
    },
    course: "",
    currentLesson: {
        lessonNumber: 0,
        lesson: "",
    },
    teachers: [],
    students: [],
  })

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { id } = useParams()
  const user = useSelector((state) => state.auth)
  const users = useSelector((state) => state.users)
  const courses = useSelector((state) => state.courses)

  useEffect(() => {
    if(users.isError || courses.isError) {
      toast.error("users: " + users.message + "\n courses: " + courses.message)
    }

    if(!user) {
      navigate("/")
      return
    }

    dispatch(getUsers())
    dispatch(getCourses())

    return () => {
      dispatch(userReset())
      dispatch(courseReset())
    }
  }, [user, navigate, users.isError, users.message, courses.isError, courses.message, dispatch])

  const teachersOptions = users.users.map((user) => {
    if (user.role.includes("teacher") && (formData.teachers.includes(user._id) || formData.teachers.includes(user.email))) {
      return {value: user._id, label: user.name, permissions: user.permissions, isSelected: true}
    } else return {value: user._id, label: user.name, permissions: user.permissions, isSelected: false}
  })
  const studentsOptions = users.users.map((user) => {
    if (user.role.includes("student") && (formData.students.includes(user._id) || formData.students.includes(user.email))) {
      return {value: user._id, label: user.name, permissions: user.permissions, isSelected: true}
    } else return {value: user._id, label: user.name, permissions: user.permissions, isSelected: false}
  })
  const coursesOptions = courses.courses.map((course) => {
    if (formData.courses.includes(course._id) || formData.courses.includes(course.title)) {
      return {value: course._id, label: course.title, isSelected: false, isFixed: false}
    } else return {value: course._id, label: course.title, isSelected: true, isFixed: false}
  })

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

  const currentClass = location.state ? location.state.currentClass : formData

  const onSubmit = (e) => {
    e.preventDefault()

    const classData = {
        title: currentClass.title,
        description: currentClass.description,
        startDateTime: currentClass.startDateTime,
        repeatDay: {
            day: currentClass.repeatDay.day,
            time: currentClass.repeatDay.time,
            count: currentClass.repeatDay.count,
        },
        course: currentClass.course,
        currentLesson: {
            lessonNumber: currentClass.currentLesson.lessonNumber,
            lesson: currentClass.currentLesson.lesson,
        },
        teachers: currentClass.teachers,
        students: currentClass.students,
    }

    if(id){
        dispatch(updateClass(classData))
    } else {
        dispatch(createClass(classData))
    }
  }

  const onSelectChange = (e, a) => {
    let selectedOptionsValues = [];

    for (let index = 0; index < e.length; index++) {
      selectedOptionsValues[index] = e[index].value
    }

    setFormData((prevState) => ({
      ...prevState,
      [a.name]: selectedOptionsValues,
    }))
  }

  if (users.isLoading || courses.isLoading) {
    return <Spinner />
  }

  return <>
      <section className="heading">
        <h1>
            <FaChalkboardTeacher /> {id ? "Editing class: " + currentClass.title : "Create class"}
        </h1>
      </section>
      <section className="form">
        <form onSubmit={onSubmit}>
          <Input  id="title" label="Title:" value={currentClass.title} 
          placeholder="Enter title" onChange={onChange} required={true} />
          <Input  id="description" label="Description:" value={currentClass.description} 
          placeholder="Enter description" onChange={onChange} />
          <Input  id="startDateTime" label="Beggining of course:" value={currentClass.startDateTime} 
          placeholder="Enter startDateTime" type="datetime-local" onChange={onChange} />
          <div className="form-group ">
            <label htmlFor="teachers">Select teachers:</label>
            <Select id="teachers" name="teachers" options={teachersOptions} onChange={onSelectChange} isMulti isSearchable />
          </div>
          <div className="form-group ">
            <label htmlFor="students">Select students:</label>
            <Select id="students" name="students" options={studentsOptions} onChange={onSelectChange} isMulti isSearchable />
          </div>
          <div className="form-group ">
            <label htmlFor="course">Select course:</label>
            <Select id="course" name="course" options={coursesOptions} onChange={onSelectChange} isSearchable />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
}

export default ClassAction