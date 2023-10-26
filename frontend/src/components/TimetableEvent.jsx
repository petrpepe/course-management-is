import * as React from "react"
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
import { useSelector } from "react-redux"
import LoadingOrError from "./LoadingOrError"

const getLocale = () => {
    const locale = navigator.language.replace("-", "");
    const rootLocale = locale.substring(0, 2);
  
    return loc[locale] || loc[rootLocale] || loc.enUS;
};

function TimetableEvent({timetables, timetableIds, lessonIds, lectorIds, classTitle, isUser}) {
    const {lessons, status: lessonStatus} = useGetData("lessons", getLessons, resetLessons, {ids: lessonIds})
    const {attendances, status: attendanceStatus} = useGetData("attendances", getAttendances, resetAttendances, {ids: timetableIds})
    const {users, status: userStatus} = useGetData("users", getUsers, resetUsers, {ids: lectorIds})
    const locale = getLocale()

    if (lessonStatus === Status.Success && userStatus === Status.Success && attendanceStatus === Status.Success) {
        return timetables.map(t => {
            let userAttendance = {}
            const event = {lessonTitle: "", classTitle: classTitle, dateTime: t.dateTime, lectors: [], background: "normal"}
            const lesson = lessons.filter(l => l._id === t.lesson)[0]
            event.lessonTitle = lesson && lesson.title
            event.lectors = users.filter(u => t.lector.includes(u._id)).map(u => u.email).join(", ")
            userAttendance = attendances.filter(a => a.timetableId === t._id)[0]
            event.background = isUser ? (userAttendance ? ((userAttendance.attended === "true") ? "green" : "red" ) : "future/nezapsano") : "normal"

            return (
            <ListItem key={t._id} sx={{width: "100%", display: "block"}}>
                <ListItemButton component={ReactLink} to={"/classes/call/" + t._id} sx={{ color: '#fff' }}>
                    <ListItemText primary={classTitle + ": " + event.lessonTitle} secondary={event.lectors} />
                    <ListItemText sx={{flex: "none"}} secondary={format(parseISO(event.dateTime),"P", {locale: locale})} />
                </ListItemButton>
            </ListItem>)
        })
    } else return <>
        <LoadingOrError status={lessonStatus} />
        <LoadingOrError status={attendanceStatus} />
        <LoadingOrError status={userStatus} />
    </>
}

export default TimetableEvent