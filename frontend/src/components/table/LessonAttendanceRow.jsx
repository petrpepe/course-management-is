import CheckBox from "../form/CheckBox"
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { useState } from "react"
import { updateAttendance, createAttendance } from "../../features/attendances/attendanceSlice"
import EditIcon from '@mui/icons-material/Edit';
import IconButton from "@mui/material/IconButton"
import ClearIcon from '@mui/icons-material/Clear';
import TextField from "@mui/material/TextField";
import SaveIcon from '@mui/icons-material/Save';
import { useDispatch } from "react-redux"

function LessonAttendanceRow({user, att}) {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({...att, userId: att.userId || user._id, note: att.note || "", attended: att.attended || false})
  const [isEdited, setIsEdited] = useState(false)

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const saveAttendance = (attendanceId) => {
    if (attendanceId) dispatch(updateAttendance(formData))
    else dispatch(createAttendance(formData))
  }

  if (isEdited) {
    return (
    <TableRow key={formData._id || formData.userId}>
      <TableCell scope="row">{user.firstName + " " + user.lastName}</TableCell>
      <TableCell>
        <TextField id="note" name="note" label="Note" value={formData.note} onChange={(e) => onChange(e)}/>
      </TableCell>
      <TableCell>
        <CheckBox id="attended" defaultChecked={formData.attended} onChange={(e) => onChange(e)}/>
      </TableCell>
      <TableCell align="center">
          <IconButton aria-label="save" onClick={() => saveAttendance(formData._id)}>
            <SaveIcon />
          </IconButton>
          <IconButton aria-label="cancel" onClick={() => setIsEdited(false)}>
            <ClearIcon />
          </IconButton>
        </TableCell>
    </TableRow>)
  }
  else {return (
    <TableRow key={formData.userId}>
        <TableCell scope="row">{user.firstName + " " + user.lastName}</TableCell>
        <TableCell>{formData.note}</TableCell>
        <TableCell align="center">
          <CheckBox id="attended" disabled={true} defaultChecked={formData.attended}/>
        </TableCell>
        <TableCell align="center">
          <IconButton aria-label="edit" onClick={() => setIsEdited(true)}>
            <EditIcon />
          </IconButton>
        </TableCell>
    </TableRow>)
  }
}

export default LessonAttendanceRow