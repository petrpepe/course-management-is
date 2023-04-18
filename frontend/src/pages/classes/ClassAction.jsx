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
//import Spinner from "../../components/Spinner"

function ClassAction() {
  const [isCreate, setIsCreate] = useState()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDateTime: "",
    repeatCount: 1,
    course: "",
    lessonNumber: 0,
    lesson: "",
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
  const classVar = useSelector((state) => state.classes.classes)

  useEffect(() => {
    if(users.isError || courses.isError) {
      toast.error("users: " + users.message + "\n courses: " + courses.message)
    }

    if(!user) {
      navigate("/")
      return
    }

    setIsCreate(false)
    dispatch(getUsers())
    dispatch(getCourses())

    return () => {
      dispatch(userReset())
      dispatch(courseReset())
    }
  }, [user, navigate, users.isError, users.message, courses.isError, courses.message, dispatch])

  if(isCreate && classVar[0]) {
    navigate("/classes/" + classVar[0]._id)
  }

  const currentClass = location.state ? location.state.currentClass : formData
  if(id !== currentClass._id) return <p>Ids are not equal</p>

  if (location.state && formData.title === "") {
    for (const key in currentClass) {
      if (Object.hasOwnProperty.call(currentClass, key)) {
        formData[key] = currentClass[key];
      }
    }

    if (formData.startDateTime) {
      formData.startDateTime = formData.startDateTime.split(":")
      formData.startDateTime.pop()
      formData.startDateTime = formData.startDateTime.join(":")
    }
  }

  if (users.users.message) {
    return toast.error(users.users.message)
  }

  const teachersOptions = users.users[0] ? users.users.filter(user => user.roles.includes("lector") || user.roles.includes("admin")).map((user) => {
    if (formData.teachers.includes(user._id) || formData.teachers.includes(user.email)) {
      return {value: user._id, label: user.lastName + " " + user.firstName, isSelected: true}
    } else return {value: user._id, label: user.lastName + " " + user.firstName, isSelected: false}
  }) : []
  const studentsOptions = users.users[0] ? users.users.map((user) => {
    if (formData.students.includes(user._id) || formData.students.includes(user.email)) {
      return {value: user._id, label: user.lastName + " " + user.firstName, isSelected: true}
    } else return {value: user._id, label: user.lastName + " " + user.firstName, isSelected: false}
  }) : []
  const coursesOptions = courses.courses[0] ? courses.courses.map((course) => {
    if (formData.course.includes(course._id) || formData.course.includes(course.title) || 
    (formData.course[0] && formData.course[0].id && formData.course[0].id.includes(course._id))) {
      return {value: course._id, label: course.title, lessons: course.lessons, isSelected: true}
    } else return {value: course._id, label: course.title, lessons: course.lessons, isSelected: false}
  }) : []

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const classData = {
      title: formData.title,
      description: formData.description,
      startDateTime: formData.startDateTime,
      repeatCount: formData.repeatCount,
      course: formData.course,
      currentLesson: {
          lessonNumber: formData.lessonNumber,
          lesson: formData.lesson,
      },
      teachers: formData.teachers,
      students: formData.students,
    }

    if(id){
      classData._id = id
      dispatch(updateClass(classData))
      navigate("/classes/" + id)
    } else {
      dispatch(createClass(classData))
      setIsCreate(true)
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

  const onCourseSelectChange = (e, a) => {
    let selectedOptionsValues = [];

    if (a.action !== "clear") {
      if (e.length > 0) {
        for (let index = 0; index < e.length; index++) {
          selectedOptionsValues[index] = {id: e[index].value, lessons: e[index].lessons}
        }
      } else selectedOptionsValues[0] = {id: e.value, lessons: e.lessons}
    }

    setFormData((prevState) => ({
      ...prevState,
      [a.name]: selectedOptionsValues,
    }))
  }

  return <>
    <section className="heading">
      <h1>
          <FaChalkboardTeacher /> {id ? "Editing class: " + currentClass.title : "Create class"}
      </h1>
    </section>
    <section className="form">
      <form onSubmit={onSubmit}>
        <Input  id="title" label="Title:" value={formData.title} 
        placeholder="Enter title" onChange={onChange} required={true} />
        <Input  id="description" label="Description:" value={formData.description} 
        placeholder="Enter description" onChange={onChange} />
        <Input  id="startDateTime" label="Beggining of course:" value={formData.startDateTime} 
        placeholder="Enter startDateTime" type="datetime-local" onChange={onChange} required={true} />
        <Input  id="repeatCount" label="repeatCount:" value={formData.repeatCount} 
        type="number" onChange={onChange} required={true} min={1} />
        <div className="form-group ">
          <label htmlFor="course">Select a course:</label>
          <Select id="course" name="course" value={coursesOptions.filter(course => course.isSelected)} options={coursesOptions} onChange={onCourseSelectChange} isSearchable isClearable/>
        </div>
        <div className="form-group ">
          <label htmlFor="teachers">Select teachers:</label>
          <Select id="teachers" name="teachers" value={teachersOptions.filter(teacher => teacher.isSelected)} options={teachersOptions} onChange={onSelectChange} isMulti isSearchable isClearable />
        </div>
        <div className="form-group ">
          <label htmlFor="students">Select students:</label>
          <Select id="students" name="students" value={studentsOptions.filter(student => student.isSelected)} options={studentsOptions} onChange={onSelectChange} isMulti isSearchable isClearable />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-block">Submit</button>
        </div>
      </form>
    </section>
  </>
}

export default ClassAction