import {useState, useEffect} from "react"
import {useSelector, useDispatch} from 'react-redux'
import {useLocation, useNavigate, useParams} from "react-router-dom"
import useForceUpdate from "../../hooks/useForceUpdate"
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
  const forceUpdate = useForceUpdate()

  const { id } = useParams()
  const user = useSelector((state) => state.auth)
  const users = useSelector((state) => state.users)
  const courses = useSelector((state) => state.courses)
  const classVar = useSelector((state) => state.classes.classes[0])

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

  const currentClass = location.state ? location.state.currentClass : formData
  if(id !== currentClass._id) return <p>Ids are not equal</p>

  if (location.state && formData.title === "") {
    for (const key in currentClass) {
      if (Object.hasOwnProperty.call(currentClass, key)) {
        formData[key] = currentClass[key];
      }
    }
  }
//filtr admin a učitele
  const teachersOptions = users.users.filter(user => user.roles.includes("")).map((user) => {
    if (formData.teachers.includes(user._id) || formData.teachers.includes(user.email)) {
      return {value: user._id, label: user.lastName + " " + user.firstName, isSelected: true}
    } else return {value: user._id, label: user.lastName + " " + user.firstName, isSelected: false}
  })
  const studentsOptions = users.users.map((user) => {
    if (formData.students.includes(user._id) || formData.students.includes(user.email)) {
      return {value: user._id, label: user.lastName + " " + user.firstName, isSelected: true}
    } else return {value: user._id, label: user.lastName + " " + user.firstName, isSelected: false}
  })
  const coursesOptions = courses.courses.map((course) => {
    if (formData.course.includes(course._id) || formData.course.includes(course.title)) {
      return {value: course._id, label: course.title, isSelected: false}
    } else return {value: course._id, label: course.title, isSelected: true}
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

    console.log(classData);

    if(id){
      classData._id = id
      dispatch(updateClass(classData))
      navigate("/classes/" + id)
    } else {
      dispatch(createClass(classData))
      forceUpdate()
      navigate("/classes/" + classVar._id)
    }
  }

  const onSelectChange = (e, a) => {
    let selectedOptionsValues = [];

    if (e.length > 0) {
      for (let index = 0; index < e.length; index++) {
        selectedOptionsValues[index] = e[index].value
      }
    } else selectedOptionsValues[0] = e.value

    setFormData((prevState) => ({
      ...prevState,
      [a.name]: selectedOptionsValues,
    }))
  }

  if (users.isLoading || courses.isLoading) {
    return <Spinner />
  }

  console.log(studentsOptions);

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
          placeholder="Enter startDateTime" type="datetime-local" onChange={onChange} required={true} />
          <Input  id="repeatCount" label="repeatCount:" value={currentClass.repeatCount} 
          type="number" onChange={onChange} required={true} min={1} />
          <div className="form-group ">
            <label htmlFor="course">Select a course:</label>
            <Select id="course" name="course" defaultInputValue={coursesOptions.filter(course => course.isSelected)} options={coursesOptions} onChange={onSelectChange} isSearchable />
          </div>
          <div className="form-group ">
            <label htmlFor="teachers">Select teachers:</label>
            <Select id="teachers" name="teachers" defaultValue={teachersOptions.filter(teacher => teacher.isSelected)} options={teachersOptions} onChange={onSelectChange} isMulti isSearchable isClearable />
          </div>
          <div className="form-group ">
            <label htmlFor="students">Select students:</label>
            <Select id="students" name="students" defaultValue={studentsOptions.filter(student => student.isSelected)} options={studentsOptions} onChange={onSelectChange} isMulti isSearchable isClearable />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">Submit</button>
          </div>
        </form>
      </section>
    </>
}

export default ClassAction