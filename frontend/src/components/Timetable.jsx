import * as React from 'react';
import {useParams} from "react-router-dom"
import {useSelector} from "react-redux"
import { getTimetables, reset as resetTimetables } from "../features/timetables/timetableSlice"
import { getClasses, reset as resetClasses } from "../features/classes/classSlice"
//import { getAttendances, reset as resetAttendances } from "../features/attendances/attendanceSlice"
import useGetData from "../hooks/useGetData"
import Typography from "@mui/material/Typography"
import Paper from '@mui/material/Paper'
import { Scheduler } from "@aldabil/react-scheduler"
import * as loc from "date-fns/locale"
import {format} from "date-fns";

function Timetable({classIds}) {
  const user = useSelector(state => state.auth.user)
  const {classes, status: classStatus} = useGetData("classes", getClasses, resetClasses, classIds, true)
  const {timetables, status: timetableStatus} = useGetData("timetables", getTimetables, resetTimetables, classIds, user._id)
  const result = getLocale()

  return (<Paper elevation={0}>
    <Typography variant="h2">Rozvrh</Typography>
    <Scheduler
      view="week"
      events={[
        {
          event_id: 1,
          title: "Event 1",
          start: new Date("2023/10/19 09:30"),
          end: new Date("2023/10/19 10:30"),
        },
        {
          event_id: 2,
          title: "Event 2",
          start: new Date("2021/5/4 10:00"),
          end: new Date("2021/5/4 11:00"),
        },
      ]}
      locale={result}
      month={{
        weekDays: [0, 1, 2, 3, 4, 5], 
        weekStartOn: 1, 
        startHour: 13, 
        endHour: 21
      }}
      dialogMaxWidth
      week={{
        weekDays: [0, 1, 2, 3, 4, 5], 
        weekStartOn: 1, 
        startHour: 13, 
        endHour: 21
      }}
      day={{
        startHour: 13, 
        endHour: 21
      }}
      hourFormat='24'
      stickyNavigation
    />
  </Paper>)
}

const getLocale = () => {
  const locale = navigator.language.replace("-", "");
  const rootLocale = locale.substring(0, 2);

  return loc[locale] || loc[rootLocale];
};

export default Timetable