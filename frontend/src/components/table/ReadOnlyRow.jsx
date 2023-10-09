import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import {useDispatch} from "react-redux"
import Box from "@mui/material/Box";

function ReadOnlyRow({ role, permissions, handleEditClick, deleteAction }) {
  const dispatch = useDispatch()

  return (
  <TableRow key={role.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
    <TableCell scope="row">{role.name}</TableCell>
    <TableCell>{role.description}</TableCell>
    <TableCell>{role.permissions.map(p => permissions.map(perm => {
      if(p === perm._id) return perm.name
      else return 0
      }).filter(p => p !== 0)).join(", ")}</TableCell>
    <TableCell>
      <Box sx={{display: "inline-flex"}} >
        <IconButton onClick={() => handleEditClick(role._id)}><EditIcon/></IconButton>
        <IconButton onClick={() => dispatch(deleteAction(role._id))}><DeleteIcon/></IconButton>
      </Box>
    </TableCell>
  </TableRow>
  );
};

export default ReadOnlyRow;