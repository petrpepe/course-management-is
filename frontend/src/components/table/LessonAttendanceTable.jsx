import CheckBox from "../form/CheckBox"
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableSortLabel from "@mui/material/TableSortLabel"
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box"
import { visuallyHidden } from '@mui/utils'
import Typography from "@mui/material/Typography"
import { Status } from "../../features/Status"

function LessonAttendanceTable({atts = [], isAdmin = []}) {
  return (
  <TableContainer component={Paper} sx={{mx: 3, width: "auto"}} >
    <Table sx={{ overflowX: "auto" }} size="small" aria-label="permissions table">
      <TableHead>
        <TableRow>
          <TableCell>Attendee</TableCell>
          <TableCell>Note</TableCell>
          <TableCell align="center" >#</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {atts.map((perm) => (
          <TableRow key={perm.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell scope="row">{perm.name}</TableCell>
            <TableCell>{perm.description}</TableCell>
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