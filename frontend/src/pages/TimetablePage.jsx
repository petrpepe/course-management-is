import {useParams} from "react-router-dom"
import {useSelector} from "react-redux"
//import { getAttendances, reset as resetAttendances } from "../features/attendances/attendanceSlice"
//import { getTimetables, reset as resetTimetables } from "../features/timetables/timetableSlice"
import { getEnrollments, reset as resetEnrollments } from "../features/enrollments/enrollmentSlice"
import useGetData from "../hooks/useGetData"
import Typography from "@mui/material/Typography"
import Timetable from "../components/Timetable"

function TimetablePage() {
  const {id} = useParams()
  const user = useSelector(state => state.auth.user)
  //const {classes, status} = useGetData("classes", getClasses, resetClasses, id, true)
  //const { users } = useGetData("users", getUsers, resetUsers)
  const {enrollments} = useGetData("enrollments", getEnrollments, resetEnrollments, id || user._id)
  //const {timetables, status} = useGetData("timetables", getTimetables, resetTimetables, id || user._id)

  return (<>
    <Timetable />
  </>)
}

export default TimetablePage