import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { visuallyHidden } from "@mui/utils";
import { Status } from "../../features/Status";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns/esm";
import { getLocale } from "../../utils";
import useGetData from "../../hooks/useGetData";
import {
  getTimetables,
  reset as resetTimetables,
} from "../../features/timetables/timetableSlice";
import {
  getLessons,
  reset as resetLessons,
} from "../../features/lessons/lessonSlice";
import { useSelector } from "react-redux";
import LoadingOrError from "../LoadingOrError";

function AttendanceTable({ attendances = [], classItem, userItem }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [sortedAtts, setSortedAtts] = useState(attendances);
  const { classes } = useSelector((state) => state.classes);
  const { timetables, status: timetableStatus } = useGetData(
    "timetables",
    getTimetables,
    resetTimetables,
    { ids: attendances.map((a) => a.timetableId) }
  );
  const { lessons, status: lessonStatus } = useGetData(
    "lessons",
    getLessons,
    resetLessons,
    { ids: timetables.map((t) => t.lesson) }
  );
  const headers = [
    { id: "classId", label: "Class" },
    { id: "lessonId", label: "Lesson" },
    { id: "userId", label: "User" },
    { id: "datetime", label: "Datetime" },
    { id: "attended", label: "Attended" },
  ];
  const locale = getLocale();
  useEffect(() => {
    if (lessonStatus === Status.Success) {
      setSortedAtts(attendances);
    }
  }, [lessonStatus, attendances]);

  const setSortOrderBy = (property) => (event) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setSortedAtts(
      [...sortedAtts].sort((a, b) => {
        if (b[property] < a[property]) {
          return order === "asc" ? -1 : 1;
        }
        if (b[property] > a[property]) {
          return order === "asc" ? 1 : -1;
        }
        return 0;
      })
    );
  };

  if (timetableStatus === Status.Loading) {
    return <LoadingOrError status={Status.Loading} />;
  }

  return (
    <TableContainer component={Paper} sx={{ mx: 3, width: "auto" }}>
      <Table
        sx={{ overflowX: "auto" }}
        size="small"
        aria-label="attendaces table">
        <TableHead>
          <TableRow>
            {headers.map((headCell) => (
              <TableCell
                key={headCell.id}
                sortDirection={orderBy === headCell.id ? order : false}>
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={setSortOrderBy(headCell.id)}>
                  {headCell.label}
                  {orderBy === headCell.id && (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  )}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell>Note</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {timetableStatus === Status.Success &&
            sortedAtts.map((att) => (
              <TableRow
                key={att._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell scope="row">
                  {
                    classes.filter(
                      (c) =>
                        c._id ===
                        timetables.filter((t) => t._id === att.timetableId)[0]
                          .classId
                    )[0]?.title
                  }
                </TableCell>
                <TableCell>
                  {lessonStatus === Status.Success &&
                    lessons.filter(
                      (l) =>
                        l._id ===
                        timetables.filter((t) => t._id === att.timetableId)[0]
                          .lesson
                    )[0]?.title}
                </TableCell>
                <TableCell>{att.userId}</TableCell>
                <TableCell>
                  {format(parseISO(att.datetime), "Pp", { locale: locale })}
                </TableCell>
                <TableCell>{att.attended === true ? "X" : "O"}</TableCell>
                <TableCell>{att.note}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AttendanceTable;
