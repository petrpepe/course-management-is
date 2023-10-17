import {useParams} from "react-router-dom"
import {useSelector} from "react-redux"
//import { getAttendances, reset as resetAttendances } from "../features/attendances/attendanceSlice"
//import { getTimetables, reset as resetTimetables } from "../features/timetables/timetableSlice"
import { getEnrollments, reset as resetEnrollments } from "../features/enrollments/enrollmentSlice"
import useGetData from "../hooks/useGetData"
import Typography from "@mui/material/Typography"

function Timetable() {
  const {id} = useParams()
  const user = useSelector(state => state.auth.user)
  //const {classes, status} = useGetData("classes", getClasses, resetClasses, id, true)
  //const { users } = useGetData("users", getUsers, resetUsers)
  const {enrollments} = useGetData("enrollments", getEnrollments, resetEnrollments, id || user._id)
  //const {timetables, status} = useGetData("timetables", getTimetables, resetTimetables, id || user._id)

  return (<>
    <Typography variant="h2">Rozvrh {(id && id !== user._id) ? "" : ": " + user.lastName + " " + user.firstName}</Typography>
    <div>{enrollments[0].student}</div>
  </>)
}

export default Timetable