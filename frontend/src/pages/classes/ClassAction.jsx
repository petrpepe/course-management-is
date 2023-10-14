import {useState, useEffect} from "react"
import {useDispatch} from 'react-redux'
import {useParams} from "react-router-dom"
import {FaChalkboardTeacher} from "react-icons/fa"
import {createClass, getClasses, updateClass, reset as resetClasses} from "../../features/classes/classSlice"
import {getUsers, reset as resetUsers} from "../../features/users/userSlice"
import {getCourses, reset as resetCourses} from "../../features/courses/courseSlice"
import TextField from "@mui/material/TextField"
import CustomSelect from "../../components/form/CustomSelect"
import Button from "@mui/material/Button"
import { Status } from "../../features/Status"
import StudentModal from "../../components/form/StudentModal"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"
import useGetData from "../../hooks/useGetData"

function ClassAction() {
  const [openModal, setOpenModal] = useState(false)

  let today = new Date()
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  today = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + "T12:00";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    place: "",
    startDateTime: today,
    course: "",
    lectors: [],
  })

  const dispatch = useDispatch()

  const { id } = useParams()
  const users = useGetData("users", getUsers, resetUsers)
  const courses = useGetData("courses", getCourses, resetCourses)
  const classes = useGetData("classes", getClasses, resetClasses)

  let currentClassId = null;
  let currentClass = id ? classes.classes.filter(c => c._id === id) : formData

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
      dispatch(updateClass(formData))
      currentClassId = id
    } else {
      dispatch(createClass(formData))
    }
    setOpenModal(true);
  }

  if(users.status === Status.Loading || courses.status === Status.Loading) {
    return <CircularProgress />
  }

  if (!id && classes.status === Status.Success) {
    currentClassId = classes.classes[classes.classes.length-1]._id;
    console.log(currentClassId);
  }

  return <>
    <section className="heading">
      <Typography variant="h2">
          <FaChalkboardTeacher /> {id ? "Editing class: " + currentClass.title : "Create class"}
      </Typography>
    </section>
    <section className="form">
      <form onSubmit={onSubmit}>
        <TextField id="title" name="title" label="Title:" value={currentClass.title} 
        onChange={(e) => onChange(e)} required={true} size="medium" fullWidth sx={{my: 1}} />
        <TextField id="description" name="description" label="Description" value={currentClass.description} 
        onChange={(e) => onChange(e)} size="medium" fullWidth sx={{my: 1}} />
        <TextField id="startDateTime" name="startDateTime" label="First lesson:" value={currentClass.startDateTime} 
        onChange={(e) => onChange(e)} size="medium" fullWidth sx={{my: 1}} type="datetime-local" InputLabelProps={{shrink: true,}} />
        <TextField id="place" name="place" label="Place (address or online url)" value={currentClass.place}
        onChange={(e) => onChange(e)} size="medium" fullWidth sx={{my: 1}} />
        <CustomSelect id="course" label="Select course" selectedItems={currentClass.course} items={courses.courses.map(c => {return {_id: c._id, title: c.title}})} 
        getItems={getCourses} itemsStatus={courses.status} formData={currentClass} setFormData={setFormData} multiple={false} />
        <CustomSelect id="lectors" label="Select lectors" selectedItems={currentClass.lectors}
        items={users.users.filter(u => u.roles.includes("lector")).map(u => {return {_id: u._id, title: u.lastName + " " + u.firstName}})} 
        getItems={getUsers} itemsStatus={users.status} formData={currentClass} setFormData={setFormData} multiple={true} />
        <Button type="submit" size="large" variant="outlined" fullWidth sx={{my: 1}}>Submit</Button>
      </form>
      <StudentModal users={users} defaultOpened={openModal} setOpenModal={setOpenModal} classId={currentClassId} />
    </section>
  </>
}

export default ClassAction