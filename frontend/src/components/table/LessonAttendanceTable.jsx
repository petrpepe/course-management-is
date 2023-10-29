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
import { getAttendances, reset as resetAttendances } from "../../features/attendances/attendanceSlice"

function LessonAttendanceTable({userIds}) {
  const { users, status: userStatus } = useGetData("users", getUsers, resetUsers, {ids: userIds})
  const { attendances, status: attendanceStatus } = useGetData("attendances", getAttendances, resetAttendances, {ids: userIds})

  if (userStatus === Status.Loading) {
    return <CircularProgress />
  }

  return (
  <TableContainer component={Paper} sx={{mx: 3, width: "auto"}} >
    <Table sx={{ overflowX: "auto" }} size="small" aria-label="attendances table">
      <TableHead>
        <TableRow>
          <TableCell>Attendee</TableCell>
          <TableCell>Note</TableCell>
          <TableCell align="center" >#</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u._id}>
            <TableCell scope="row">{u.firstName + " " + u.lastName}</TableCell>
            <TableCell>{u.note}</TableCell>
            <TableCell>{u.attended}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  )
/*
<tbody>
        {atts.map(attendance => {
          return (
            <tr key={attendance.user}>
              <td>{attendance.name}</td>
              <td><CheckBox id="attType" defaultValue={attendance.attType === "true" ? true : false} 
              attId={attendance._id} userId={attendance.user} /></td>
            </tr>
          )
          })}
      </tbody>
      </table>
*/
}

export default LessonAttendanceTable