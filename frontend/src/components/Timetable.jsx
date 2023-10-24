import * as React from 'react';
import {useSelector} from "react-redux"
import { getTimetables, reset as resetTimetables } from "../features/timetables/timetableSlice"
import useGetData from "../hooks/useGetData"
import Typography from "@mui/material/Typography"
import Paper from '@mui/material/Paper'
import TimetableEvent from './TimetableEvent';
import List from '@mui/material/List';
import { Status } from '../features/Status';
import CircularProgress from '@mui/material/CircularProgress';
import { compareAsc, parseISO } from "date-fns"
import { Box } from '@mui/material';

function Timetable({classIds, classes}) {
  const user = useSelector(state => state.auth.user)
  const {timetables, status: timetableStatus} = useGetData("timetables", getTimetables, resetTimetables, {ids: classIds, userId: user._id})

  if (timetableStatus === Status.Loading) {
    return <CircularProgress />
  }

  let sortedTimetables = []
  for (const cid of classes.map(c => c._id)) {
    sortedTimetables.push({classId: cid, timetables: timetables.filter(t => t.classId === cid)})
    sortedTimetables.find(a => a.classId === cid).timetables.sort((a,b) => compareAsc(parseISO(a.dateTime), parseISO(b.dateTime)))
  }

  return (<Paper elevation={0}>
    {sortedTimetables.map(ts => 
    <Box key={ts.classId} sx={{m: 1, width: {xs: "100%", md: "50%",lg: "40%"}, display: "inline-block"}}>
      {sortedTimetables.length > 1 && <Typography>{classes.filter(c => c._id === ts.classId)[0].title}</Typography>}
      <List sx={{bgcolor: 'background.paper', border: "1px solid"}}>
        {ts.timetables.map(t =>
          <TimetableEvent key={t._id} lessonId={t.lesson} timetableId={t._id} classTitle={classes.filter(c => c._id === t.classId)[0].title}
          dateTime={t.dateTime} lectorIds={t.lector} isUser={user._id} />
        )}
      </List>
    </Box>
    )}
  </Paper>)
}

export default Timetable