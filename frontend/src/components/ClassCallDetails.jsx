import useGetData from "../hooks/useGetData"
import { Status } from "../features/Status"
import {getLessons, reset as resetLessons} from "../features/lessons/lessonSlice"
import { getClasses, reset as resetClasses } from "../features/classes/classSlice"
import { getEnrollments, reset as resetEnrollments } from "../features/enrollments/enrollmentSlice"
import Typography from "@mui/material/Typography"
import CircularProgress from "@mui/material/CircularProgress"
import LessonAttendanceTable from "./table/LessonAttendanceTable"
import Box from "@mui/material/Box"

function ClassCallDetails({classId, lessonId, timetableId}) {
    const { lessons, status: lessonStatus } = useGetData("lessons", getLessons, resetLessons, {ids: lessonId, detail: true})
    const { classes, status: classStatus } = useGetData("classes", getClasses, resetClasses, {ids: classId})
    const { enrollments, status: enrollmentStatus} = useGetData("enrollments", getEnrollments, resetEnrollments, {ids: classId})

    if (lessonStatus === Status.Loading || classStatus === Status.Loading || 
        lessonStatus === Status.Idle || classStatus === Status.Idle || enrollmentStatus === Status.Loading) {
       return <CircularProgress />
    }

    const lesson = lessons.filter(l => l._id === lessonId)[0]
    const classVar = classes.filter(c => c._id === classId)[0]

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