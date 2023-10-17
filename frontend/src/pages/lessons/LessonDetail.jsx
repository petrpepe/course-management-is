import {Link as ReactLink, useParams} from "react-router-dom"
import {getLessons, reset as resetLessons} from "../../features/lessons/lessonSlice"
import { Status } from "../../features/Status"
import Typography from "@mui/material/Typography"
import useGetData from "../../hooks/useGetData"
import CourseTitleLink from "../../components/CourseTitleLink"
import CircularProgress from "@mui/material/CircularProgress"
import Button from "@mui/material/Button"

function LessonDetail() {
  const {id} = useParams()
  const {lessons, status} = useGetData("lessons", getLessons, resetLessons, id, true)

  if (status === Status.Loading || status === Status.Idle) {
    return <CircularProgress />
  }

  if (status === Status.Success && lessons[0].content === undefined) {
    return <CircularProgress />
  }

  return (<>
    <Typography variant="h2">Lesson {lessons[0].lessonNum}: {lessons[0].title}</Typography>
    <Typography variant="h3">{lessons[0].description}</Typography>
    <CourseTitleLink courseId={lessons[0].course} />
    <Typography variant="body1" fontSize="large">{lessons[0].materials}</Typography>
    {lessons[0].content.split("\\n").map((c, i) =>
      <Typography key={i} variant="body1" fontSize="large" textAlign="left" sx={{ m: 1.5 }}>{c}</Typography>
    )}
    <Button component={ReactLink} to={"/lessons/" + lessons[0]._id + "/edit"} sx={{ my: 1 }}>Edit</Button>
  </>)
}

export default LessonDetail