import Typography from "@mui/material/Typography"
import { useSelector } from "react-redux"
import { Status } from "../features/Status"

function ClassLessonTitle({classId, lessonId}) {
    const classes = useSelector(state => state.classes)
    const classVar = classes.classes.filter(c => c._id === classId)[0]
    const lessons = useSelector(state => state.lessons)
    const lesson = lessons.lessons.filter(l => l._id === lessonId)[0]

    if (classes.status === Status.Success && lessons.status === Status.Success) {
        return <>
            <Typography variant="h2" sx={{display: "block", width: "100%"}}>{classVar.title + ": " + lesson.title}</Typography>
            <Typography variant="body1">{lesson.materials}</Typography>
        </>
    }
}

export default ClassLessonTitle