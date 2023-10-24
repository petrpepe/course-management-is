import {Link as ReactLink, useEffect, useRef} from "react"
import { getLessons, reset as resetLessons } from "../features/lessons/lessonSlice"
import { getAttendances, reset as resetAttendances } from "../features/attendances/attendanceSlice"
import { getUsers, reset as resetUsers } from "../features/users/userSlice"
import useGetData from "../hooks/useGetData"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
//import Typography from "@mui/material/Typography"
import { Status } from "../features/Status"
import { CircularProgress } from "@mui/material"
import * as loc from "date-fns/locale"
import {format, parseISO} from "date-fns/esm"

const getLocale = () => {
    const locale = navigator.language.replace("-", "");
    const rootLocale = locale.substring(0, 2);
  
    return loc[locale] || loc[rootLocale] || loc.enUS;
};

function TimetableEvent({lessonId, timetableId, classTitle, dateTime, lectorIds, isUser}) {
    const {lessons, status: lessonStatus} = useGetData("lessons", getLessons, resetLessons, {ids: lessonId})
    const {attendances, status: attendanceStatus} = useGetData("attendances", getAttendances, resetAttendances, {ids: timetableId})
    const {users, status: userStatus} = useGetData("users", getUsers, resetUsers, {ids: lectorIds})
    let userAttendance = useRef({})
    let event = {lessonTitle: "", classTitle: classTitle, dateTime: dateTime, background: "normal"}
    const locale = getLocale()

    if (lessonStatus === Status.Success) {
        const lesson = lessons.filter(l => l._id === lessonId)[0]
        event.lessonTitle = lesson && lesson.title
    }

    if (userStatus === Status.Success) {
        event.lectors = users.filter(u => lectorIds.includes(u._id)).map(u => u.email).join(", ")
    }

    if (attendanceStatus === Status.Success) {
        userAttendance.current = attendances.filter(a => a.timetableId === timetableId)[0]
        event.background = isUser ? (userAttendance ? ((userAttendance.attType === "attended") ? "green" : "red" ) : "future") : "normal"
    }


    if (lessonStatus === Status.Loading || attendanceStatus === Status.Loading || lessonStatus === Status.Idle || attendanceStatus === Status.Idle) {
        return <CircularProgress />
    }

    return (
    <ListItem sx={{width: "100%", display: "block"}}>
        <ListItemButton component={ReactLink} to={"/classes/call/" + event._id} sx={{ color: '#fff' }}>
            <ListItemText primary={classTitle + ": " + event.lessonTitle} secondary={format(parseISO(event.dateTime),"P", {locale: locale})} />
        </ListItemButton>
    </ListItem>
    )
}

export default TimetableEvent