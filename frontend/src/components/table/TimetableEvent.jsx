import * as React from "react";
import { Link as ReactLink } from "react-router-dom";
import {
  getLessons,
  reset as resetLessons,
} from "../../features/lessons/lessonSlice";
import {
  getAttendances,
  reset as resetAttendances,
} from "../../features/attendances/attendanceSlice";
import { getUsers, reset as resetUsers } from "../../features/users/userSlice";
import useGetData from "../../hooks/useGetData";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Status } from "../../features/Status";
import { format, parseISO, isFuture } from "date-fns/esm";
import LoadingOrError from "../LoadingOrError";
import { getLocale } from "../../utils";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";

function TimetableEvent({
  timetables,
  lessonIds,
  lectorIds,
  classTitle,
  classId,
}) {
  const { user } = useSelector((state) => state.auth);
  const { lessons, status: lessonStatus } = useGetData(
    "lessons",
    getLessons,
    resetLessons,
    { ids: lessonIds }
  );
  const { attendances, status: attendanceStatus } = useGetData(
    "attendances",
    getAttendances,
    resetAttendances,
    {
      ids: user._id,
    }
  );
  const { users, status: userStatus } = useGetData(
    "users",
    getUsers,
    resetUsers,
    { ids: lectorIds }
  );

  const locale = getLocale();

  if (lessonStatus === Status.Success && attendanceStatus === Status.Success) {
    return timetables.map((t) => {
      let userAttendance = {};
      const event = {
        lessonTitle: "",
        classTitle: classTitle,
        datetime: t.datetime,
        lectors: [],
        background: "normal",
      };
      const lesson =
        lessons.length > 0 && lessons.filter((l) => l._id === t.lesson)[0];
      event.lessonTitle = lesson && lesson.title;
      event.lectors = users
        .filter((u) => t.lectors.includes(u._id))
        .map((u) => u.email)
        .join(", ");
      userAttendance = attendances.filter((a) => a.timetableId === t._id)[0];
      if (user.roles.includes("student")) {
        event.background = userAttendance
          ? userAttendance.attended === true
            ? "green"
            : "red"
          : !isFuture(parseISO(event.datetime)) && "red";
      }

      return (
        <ListItem
          key={t._id}
          sx={{ width: "100%", display: "block", px: 2 }}
          secondaryAction={
            user.roles.includes("admin") && (
              <IconButton
                component={ReactLink}
                to={"/timetableEvent/" + classId + "/" + t._id}>
                <EditIcon />
              </IconButton>
            )
          }>
          <ListItemButton component={ReactLink} to={"/classes/call/" + t._id}>
            <ListItemText
              primary={classTitle + ": " + event.lessonTitle}
              secondary={event.lectors}
              sx={{ color: event.background }}
            />
            <ListItemText
              sx={{ flex: "none" }}
              secondary={format(parseISO(event.datetime), "Pp", {
                locale: locale,
              })}
            />
          </ListItemButton>
        </ListItem>
      );
    });
  } else
    return (
      <>
        <LoadingOrError status={lessonStatus} />
        <LoadingOrError status={attendanceStatus} />
        <LoadingOrError status={userStatus} />
      </>
    );
}

export default TimetableEvent;
