import * as React from "react";
import { Link as ReactLink } from "react-router-dom";
import {
  getTimetables,
  reset as resetTimetables,
} from "../../features/timetables/timetableSlice";
import useGetData from "../../hooks/useGetData";
import Paper from "@mui/material/Paper";
import TimetableEvent from "./TimetableEvent";
import List from "@mui/material/List";
import { Status } from "../../features/Status";
import { compareAsc, parseISO } from "date-fns";
import Box from "@mui/material/Box";
import LoadingOrError from "../LoadingOrError";
import Button from "@mui/material/Button";

function Timetable({ classes, userIds }) {
  const ids = classes.map((c) => c._id);
  if (userIds) ids.push(userIds);
  const { timetables, status: timetableStatus } = useGetData(
    "timetables",
    getTimetables,
    resetTimetables,
    {
      ids: ids,
    }
  );

  if (timetableStatus === Status.Success) {
    let sortedTimetables = [];
    for (const cid of classes.map((c) => c._id)) {
      sortedTimetables.push({
        classId: cid,
        timetables: timetables.filter((t) => t.classId === cid),
      });
      sortedTimetables
        .find((a) => a.classId === cid)
        .timetables.sort((a, b) =>
          compareAsc(parseISO(a.datetime), parseISO(b.datetime))
        );
    }
    const timetableIds = timetables.map((t) => t._id);
    const lessonIds = timetables.map((t) => t.lesson);
    const lectorIds = [...new Set(timetables.map((t) => t.lector))];

    return (
      <Paper elevation={0}>
        {sortedTimetables.map((ts) => (
          <Box
            key={ts.classId}
            sx={{
              m: 1,
              width: { xs: "100%", md: "50%", lg: "40%" },
              display: "inline-block",
            }}>
            {sortedTimetables.length > 1 && (
              <Button component={ReactLink} to={"../classes/" + ts.classId}>
                {classes.filter((c) => c._id === ts.classId)[0].title}
              </Button>
            )}
            <List sx={{ bgcolor: "background.paper", border: "1px solid" }}>
              <TimetableEvent
                timetables={ts.timetables}
                classTitle={
                  classes.filter((c) => c._id === ts.classId)[0].title
                }
                lectorIds={lectorIds}
                lessonIds={lessonIds}
                timetableIds={timetableIds}
              />
            </List>
          </Box>
        ))}
      </Paper>
    );
  } else return <LoadingOrError status={timetableStatus} />;
}

export default Timetable;
