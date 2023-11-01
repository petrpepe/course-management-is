import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";

function ReadOnlyRow({ role, permissions, handleEditClick, deleteAction }) {
  const dispatch = useDispatch();
  const rolePerms = role.permissions
    .map((p) =>
      permissions
        .map((perm) => {
          if (p === perm._id) return perm.name;
          else return 0;
        })
        .filter((p) => p !== 0),
    )
    .join(", ");

  return (
    <>
      <TableCell scope="row">{role.name}</TableCell>
      <TableCell>{role.description}</TableCell>
      <TableCell>{rolePerms}</TableCell>
      <TableCell>
        <Box sx={{ display: "inline-flex" }}>
          <IconButton onClick={() => handleEditClick(role._id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => dispatch(deleteAction(role._id))}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </TableCell>
    </>
  );
}

export default ReadOnlyRow;
