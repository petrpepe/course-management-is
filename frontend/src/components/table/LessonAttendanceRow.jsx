import CheckBox from "../form/CheckBox"
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { useEffect, useState } from "react"
import { updateAttendance, createAttendance } from "../../features/attendances/attendanceSlice"

function LessonAttendanceRow({user, att}) {
  const  [formData, setFormData] = useState(att)

  return (
    <TableRow key={formData._id}>
        <TableCell scope="row">{user.firstName + " " + user.lastName}</TableCell>
        <TableCell>{formData.note}</TableCell>
        <TableCell>{formData.attended}</TableCell>
    </TableRow>)
}

export default LessonAttendanceRow