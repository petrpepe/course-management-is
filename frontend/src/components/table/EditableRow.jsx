import { useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import CustomSelect from "../form/CustomSelect";
import ClearIcon from '@mui/icons-material/Clear';
import TextField from "@mui/material/TextField";
import SaveIcon from '@mui/icons-material/Save';
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

function EditableRow({ role, permissions, status, getPermissions, setEdit, handleCancelClick }) {
  const [rowState, setRow] = useState({...role})

  const onChange = e => {
    const inputName = e.target.name

    setRow({
      ...rowState,
      [inputName]: e.target.value
    })

    setEdit({
      ...rowState,
      [inputName]: e.target.value,
      isEdited: true,
    })
  }

  return (
    <TableRow>
      <TableCell>
        <TextField id="name" name="name" label="Name:" placeholder="Enter name" onChange={(e) => onChange(e)} 
        required={true} size="medium" fullWidth sx={{my: 1}} value={rowState.name} />
      </TableCell>
      <TableCell>
        <TextField  id="description" name="description" label="Description:" placeholder="Enter description" onChange={(e) => onChange(e)} 
        required={true} size="medium" fullWidth sx={{my: 1}} value={rowState.description} />
      </TableCell>
        <TableCell>
          <CustomSelect
            id="permissions" label="Select permissions" items={permissions.map(p => {return {_id: p._id, title: p.name}})} 
            getItems={getPermissions} itemsStatus={status} formData={role} setFormData={setRow} multiple={true}
          />
        </TableCell>
      <TableCell>
        <Box sx={{display: "inline-flex"}}>
          <IconButton type="submit"><SaveIcon/></IconButton>
          <IconButton onClick={() => handleCancelClick()}><ClearIcon/></IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default EditableRow;