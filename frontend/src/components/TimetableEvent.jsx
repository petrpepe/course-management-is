import {Link as ReactLink} from "react-router-dom"
import { getLessons, reset as resetLessons } from "../features/lessons/lessonSlice"
import { getAttendances, reset as resetAttendances } from "../features/attendances/attendanceSlice"
import { getUsers, reset as resetUsers } from "../features/users/userSlice"
import useGetData from "../hooks/useGetData"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import { Status } from "../features/Status"
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
    let userAttendance = {}
    let event = {lessonTitle: "", classTitle: classTitle, dateTime: dateTime, lectors: [], background: "normal"}
    const locale = getLocale()

    if (lessonStatus === Status.Success && userStatus === Status.Success && attendanceStatus === Status.Success) {
        const lesson = lessons.filter(l => l._id === lessonId)[0]
        event.lessonTitle = lesson && lesson.title
        event.lectors = users.filter(u => lectorIds.includes(u._id)).map(u => u.email).join(", ")
        userAttendance.current = attendances.filter(a => a.timetableId === timetableId)[0]
        event.background = isUser ? (userAttendance ? ((userAttendance.attended === "true") ? "green" : "red" ) : "future/nezapsano") : "normal"

        return (
        <ListItem sx={{width: "100%", display: "block"}}>
            <ListItemButton component={ReactLink} to={"/classes/call/" + timetableId} sx={{ color: '#fff' }}>
                <ListItemText primary={classTitle + ": " + event.lessonTitle} secondary={event.lectors} />
                <ListItemText sx={{flex: "none"}} secondary={format(parseISO(event.dateTime),"P", {locale: locale})} />
            </ListItemButton>
        </ListItem>)   
    }
}

export default TimetableEvent