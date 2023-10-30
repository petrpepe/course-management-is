import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from "@mui/material/Paper"
import { Status } from "../../features/Status"
import {getUsers, reset as resetUsers} from "../../features/users/userSlice"
import useGetData from "../../hooks/useGetData"
import CircularProgress from "@mui/material/CircularProgress"
import EditIcon from '@mui/icons-material/Edit';
import { getAttendances, reset as resetAttendances } from "../../features/attendances/attendanceSlice"
import LessonAttendanceRow from './LessonAttendanceRow'

function LessonAttendanceTable({timetable, enrolledUsers}) {
  const { users, status: userStatus } = useGetData("users", getUsers, resetUsers, {ids: enrolledUsers})
  const { attendances, status: attendanceStatus } = useGetData("attendances", getAttendances, resetAttendances, {ids: enrolledUsers})

  if (userStatus === Status.Loading || attendanceStatus === Status.Loading) {
    return <CircularProgress />
  }

  if (userStatus === Status.Success && attendanceStatus === Status.Success) {
  const newAtt = {datetime: timetable.datetime, timetableId: timetable._id, userId: "", attended: false, note: "" }

  return (
  <TableContainer component={Paper} sx={{mx: 3, width: "auto"}} >
    <Table sx={{ overflowX: "auto" }} size="small" aria-label="attendances table">
      <TableHead>
        <TableRow>
          <TableCell sx={{width: "15%"}}>Attendee</TableCell>
          <TableCell sx={{width: "25%"}}>Datetime</TableCell>
          <TableCell sx={{width: "45%"}}>Note</TableCell>
          <TableCell align="center" sx={{width: "1%"}}>#</TableCell>
          <TableCell align="center" sx={{width: "14%"}}><EditIcon/></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((u) => (
          <LessonAttendanceRow key={u._id} att={attendances.filter(att => att.userId === u._id).length > 0 ? attendances.filter(att => att.userId === u._id)[0] : newAtt} user={u} />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  )}
}

export default LessonAttendanceTable