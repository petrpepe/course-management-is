import {Link as ReactLink, useParams} from "react-router-dom"
import {getClasses, reset as resetClasses} from "../../features/classes/classSlice"
import { Status } from "../../features/Status"
import Typography from "@mui/material/Typography"
import useGetData from "../../hooks/useGetData"
import CourseTitleLink from "../../components/CourseTitleLink"
import CircularProgress from "@mui/material/CircularProgress"
import LessonsList from "../../components/LessonsList"
import Button from "@mui/material/Button"
import { getEnrollments, reset as resetEnrollments } from "../../features/enrollments/enrollmentSlice"
import UsersList from "../../components/UsersList"

function ClassDetail() {
  const {id} = useParams()
  const {classes, status} = useGetData("classes", getClasses, resetClasses, id, true)
  const enrollments = useGetData("enrollments", getEnrollments, resetEnrollments, id)

  if (status === Status.Loading || status === Status.Idle || enrollments.status === Status.Loading || enrollments.status === Status.Idle) {
    return <CircularProgress sx={{position: "absolute", top: "50%"}} />
  }

  return (<>
    <Typography variant="h2">Class: {classes[0].title}</Typography>
    <Typography variant="h3">{classes[0].description}</Typography>
    <CourseTitleLink courseId={classes[0].course}/>
    <LessonsList courseId={classes[0].course} />
    <UsersList usersIds={enrollments.enrollments.flatMap(e => e.student)} heading="students" />
    <UsersList usersIds={classes[0].lectors} heading="lectors" />
    <Button component={ReactLink} to={"/classes/" + classes[0]._id + "/edit"} sx={{ my: 1 }}>Edit</Button>
  </>)
}

export default ClassDetail