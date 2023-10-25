import {useParams} from "react-router-dom"
import {useSelector} from "react-redux"
import { getEnrollments, reset as resetEnrollments } from "../features/enrollments/enrollmentSlice"
import { getClasses, reset as resetClasses } from "../features/classes/classSlice"
import useGetData from "../hooks/useGetData"
import Typography from "@mui/material/Typography"
import Timetable from "../components/Timetable"
import { Status } from "../features/Status"
import { CircularProgress } from "@mui/material"

function TimetablePage() {
  const {id} = useParams()
  const user = useSelector(state => state.auth.user)
  const {classes, status: classStatus} = useGetData("classes", getClasses, resetClasses, {ids: id})
  const {enrollments, status: enrollmentStatus} = useGetData("enrollments", getEnrollments, resetEnrollments, {ids: id || user._id})

  if(classStatus === Status.Loading || enrollmentStatus === Status.Loading) {
    return <CircularProgress sx={{position: "absolute", top: "50%"}}/>
  }
  enrollments.map((e) => e)
  return (<>
    <Typography variant="h2">Rozvrh</Typography>
    <Timetable classIds={classes.map(c => c._id)} classes={classes} />
  </>)
}

export default TimetablePage