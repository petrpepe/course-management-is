import * as React from 'react';
import { getTimetables, reset as resetTimetables } from "../features/timetables/timetableSlice"
import useGetData from "../hooks/useGetData"
import Typography from "@mui/material/Typography"
import Paper from '@mui/material/Paper'
import TimetableEvent from './TimetableEvent';
import List from '@mui/material/List';
import { Status } from '../features/Status';
import { compareAsc, parseISO } from "date-fns"
import Box from '@mui/material/Box';
import LoadingOrError from "../components/LoadingOrError"

function Timetable({classIds, userIds, classes, byUser}) {
  const {timetables, status: timetableStatus} = useGetData("timetables", getTimetables, resetTimetables, {ids: classIds, userId: userIds})

  if (timetableStatus === Status.Success) {
    let sortedTimetables = []
    for (const cid of classes.map(c => c._id)) {
      sortedTimetables.push({classId: cid, timetables: timetables.filter(t => t.classId === cid)})
      sortedTimetables.find(a => a.classId === cid).timetables.sort((a,b) => compareAsc(parseISO(a.dateTime), parseISO(b.dateTime)))
    }
    const timetableIds = timetables.map(t => t._id)
    const lessonIds = timetables.map(t => t.lesson)
    const lectorIds = sortedTimetables.map(t => t.lector)

    return (<Paper elevation={0}>
      {sortedTimetables.map(ts => 
      <Box key={ts.classId} sx={{m: 1, width: {xs: "100%", md: "50%",lg: "40%"}, display: "inline-block"}}>
        {sortedTimetables.length > 1 && <Typography>{classes.filter(c => c._id === ts.classId)[0].title}</Typography>}
        <List sx={{bgcolor: 'background.paper', border: "1px solid"}}>
          <TimetableEvent timetables={ts.timetables} classTitle={classes.filter(c => c._id === ts.classId)[0].title} isUser={byUser}
          lectorIds={lectorIds} lessonIds={lessonIds} timetableIds={timetableIds} />
        </List>
      </Box>
      )}
    </Paper>)
  } else return <LoadingOrError status={timetableStatus} />
}

export default Timetable