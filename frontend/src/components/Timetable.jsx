import * as React from 'react';
import {useSelector} from "react-redux"
import { getTimetables, reset as resetTimetables } from "../features/timetables/timetableSlice"
import { getClasses, reset as resetClasses } from "../features/classes/classSlice"
import useGetData from "../hooks/useGetData"
import Typography from "@mui/material/Typography"
import Paper from '@mui/material/Paper'
import * as loc from "date-fns/locale"
//import {format} from "date-fns"
import TimetableEvent from './TimetableEvent';
import List from '@mui/material/List';
import { Status } from '../features/Status';
import CircularProgress from '@mui/material/CircularProgress';

function Timetable({classIds}) {
  const user = useSelector(state => state.auth.user)
  const {timetables, status: timetableStatus} = useGetData("timetables", getTimetables, resetTimetables, {ids: classIds, userId: user._id})
  const {classes, status: classStatus} = useGetData("classes", getClasses, resetClasses, {ids: classIds})
  const result = getLocale()
  const events = []

  if (timetableStatus === Status.Loading || classStatus === Status.Loading) {
    return <CircularProgress />
  }

  return (<Paper elevation={0}>
    <Typography variant="h2">Rozvrh</Typography>
    <List sx={{mb: 1, width: '100%', bgcolor: 'background.paper', border: "1px solid" }}>
      {timetables.map((t) => (
        <TimetableEvent lessonId={t.lesson} timetableId={t._id} classTitle={classes.filter(c => c._id === t.classId)[0].title}
        dateTime={t.dateTime} lectorIds={t.lector} isUser={user._id} />
      ))}
    </List>
  </Paper>)
}

const getLocale = () => {
  const locale = navigator.language.replace("-", "");
  const rootLocale = locale.substring(0, 2);

  return loc[locale] || loc[rootLocale] || loc.enUS;
};

export default Timetable