import useGetData from "../hooks/useGetData"
import { Status } from "../features/Status"
import {getLessons, reset as resetLessons} from "../features/lessons/lessonSlice"
import { getEnrollments, reset as resetEnrollments } from "../features/enrollments/enrollmentSlice"
import Typography from "@mui/material/Typography"
import CircularProgress from "@mui/material/CircularProgress"
import LessonAttendanceTable from "./table/LessonAttendanceTable"
import Box from "@mui/material/Box"

function ClassCallDetails({classId, lessonId, timetableId}) {
    const { lessons, status: lessonStatus } = useGetData("lessons", getLessons, resetLessons, {ids: lessonId, detail: true})
    const { enrollments, status: enrollmentStatus} = useGetData("enrollments", getEnrollments, resetEnrollments, {ids: classId})

    if (lessonStatus === Status.Loading || lessonStatus === Status.Idle || enrollmentStatus === Status.Loading || enrollmentStatus === Status.Idle) {
       return <CircularProgress />
    }

    const lesson = lessons.filter(l => l._id === lessonId)[0]

    return (
    <Box sx={{width: "100%", display: "block"}}>
        {lesson.content.split("\\n").map((c, i) =>
            <Typography key={i} variant="body1" fontSize="large" textAlign="left" sx={{ m: 1.5 }}>{c}</Typography>
        )}
        {
            <LessonAttendanceTable timetable={timetableId} enrollments={enrollments.map(e => e.student)} />
        }
    </Box>)
}

export default ClassCallDetails