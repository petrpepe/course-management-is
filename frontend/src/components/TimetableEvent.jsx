import {Link as ReactLink} from "react"
import { getLessons, reset as resetLessons } from "../features/lessons/lessonSlice"
import { getAttendances, reset as resetAttendances } from "../features/attendances/attendanceSlice"
import { getUsers, reset as resetUsers } from "../features/users/userSlice"
import useGetData from "../hooks/useGetData"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import { useSelector } from "react-redux"
import { Status } from "../features/Status"
import { CircularProgress } from "@mui/material"

function TimetableEvent({lessonId, timetableId, classTitle, dateTime, lectorIds, isUser}) {
    const {lessons, status: lessonStatus} = useGetData("lessons", getLessons, resetLessons, {ids: lessonId})
    const {attendances, status: attendanceStatus} = useGetData("attendances", getAttendances, resetAttendances, {ids: timetableId})
    const {users, status: userStatus} = useGetData("users", getUsers, resetUsers, {ids: lectorIds})
    let userAttendance = {}
    let event = {lessonTitle: "", classTitle: classTitle, dateTime: dateTime, background: "normal"}

    if (lessonStatus === Status.Loading || attendanceStatus === Status.Loading) {
        return <CircularProgress />
    }

    if (lessonStatus === Status.Success && attendanceStatus === Status.Success) {
        event.lessonTitle = lessons.filter(l => l.id === lessonId)[0].title
        userAttendance = attendances.filter(a => a.timetableId === timetableId)[0]
        event.background = isUser ? (userAttendance ? ((userAttendance.attType === "attended") ? "green" : "red" ) : "future") : "normal"
    }

    return (
    <ListItem key={event._id} sx={{width: {xs: "100%", md: "50%",lg: "33%"}, display: "block"}}>
        <ListItemButton component={ReactLink} to={"/classes/call"} sx={{ color: '#fff' }}>
            <ListItemText primary={event.title} secondary={event.dateTime} />
        </ListItemButton>
    </ListItem>
    )
}

export default TimetableEvent