import { useState } from "react";
import TableCell from "@mui/material/TableCell";
import CustomSelect from "../form/CustomSelect";
import ClearIcon from '@mui/icons-material/Clear';
import TextField from "@mui/material/TextField";
import SaveIcon from '@mui/icons-material/Save';
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { updateRole } from "../../features/roles/roleSlice";
import { useDispatch } from "react-redux";

function EditableRow({ role, permissions, status, getPermissions, handleCancelClick }) {
  const dispatch = useDispatch()
  const [rowState, setRow] = useState({...role})

  const onChange = e => {
    const inputName = e.target.name

    setRow({
      ...role,
      [inputName]: e.target.value
    })
  }

  const handleSaveClick = e => {
    e.preventDefault()
    rowState.permissions = rowState.permissions || []
    dispatch(updateRole(rowState))
    handleCancelClick()
  }

  return (
    <>
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
            selectedItems={rowState.permissions} itemsStatus={status} formData={rowState} setFormData={setRow} multiple={true}
          />
        </TableCell>
      <TableCell>
        <Box sx={{display: "inline-flex"}}>
          <IconButton onClick={handleSaveClick}><SaveIcon/></IconButton>
          <IconButton onClick={() => handleCancelClick()}><ClearIcon/></IconButton>
        </Box>
      </TableCell>
    </>
  );
};

export default EditableRow;