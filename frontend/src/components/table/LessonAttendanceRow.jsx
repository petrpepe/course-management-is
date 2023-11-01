import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import {
  updateAttendance,
  createAttendance,
} from "../../features/attendances/attendanceSlice";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import { useDispatch } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import { format, parseISO } from "date-fns/esm";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { getLocale } from "../../utils";

function LessonAttendanceRow({ user, att }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    ...att,
    userId: att.userId || user._id,
  });
  const [isEdited, setIsEdited] = useState(false);
  const locale = getLocale();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onCheckboxChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.checked,
    }));
  };

  const saveAttendance = (attendanceId) => {
    if (attendanceId) dispatch(updateAttendance(formData));
    else dispatch(createAttendance(formData));
  };

  if (isEdited) {
    return (
      <TableRow key={formData._id || formData.userId}>
        <TableCell scope="row">
          {user.firstName + " " + user.lastName}
        </TableCell>
        <TableCell>
          <DateTimePicker
            id="datetime"
            name="datetime"
            label="Datetime"
            value={parseISO(formData.datetime)}
            onChange={(e) => onChange(e)}
            sx={{ width: "100%" }}
          />
        </TableCell>
        <TableCell>
          <TextField
            id="note"
            name="note"
            label="Note"
            value={formData.note}
            onChange={(e) => onChange(e)}
            fullWidth
          />
        </TableCell>
        <TableCell>
          <Checkbox
            id="attended"
            checked={formData.attended}
            onChange={(e) => onCheckboxChange(e)}
          />
        </TableCell>
        <TableCell align="center" sx={{ p: 0 }}>
          <IconButton
            aria-label="save"
            onClick={() => saveAttendance(formData._id)}
          >
            <SaveIcon />
          </IconButton>
          <IconButton aria-label="cancel" onClick={() => setIsEdited(false)}>
            <ClearIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  } else {
    return (
      <TableRow key={formData.userId}>
        <TableCell scope="row">
          {user.firstName + " " + user.lastName}
        </TableCell>
        <TableCell>
          {format(parseISO(formData.datetime), "Pp", { locale: locale })}
        </TableCell>
        <TableCell>{formData.note}</TableCell>
        <TableCell align="center">
          <Checkbox
            id="attendedDisabled"
            checked={formData.attended}
            disabled
          />
        </TableCell>
        <TableCell align="center" sx={{ p: 0 }}>
          <IconButton aria-label="edit" onClick={() => setIsEdited(true)}>
            <EditIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  }
}

export default LessonAttendanceRow;
