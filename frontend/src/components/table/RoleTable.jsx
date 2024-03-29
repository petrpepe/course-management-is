import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createRole, deleteRole } from "../../features/roles/roleSlice";
import {
  getPermissions,
  reset as resetPermissions,
} from "../../features/permissions/permissionSlice";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";
import { Status } from "../../features/Status";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CustomSelect from "../form/CustomSelect";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { visuallyHidden } from "@mui/utils";
import Typography from "@mui/material/Typography";
import useGetData from "../../hooks/useGetData";
import CircularProgress from "@mui/material/CircularProgress";

function RoleTable({ roles, rolesStatus }) {
  const dispatch = useDispatch();

  const [role, setState] = useState({
    name: "",
    description: "",
    permissions: [],
  });
  const [editRole, setEdit] = useState({ _id: "", role: {}, isEdited: false });
  const { permissions, status } = useGetData(
    "permissions",
    getPermissions,
    resetPermissions
  );
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [sortedRoles, setSortedRoles] = useState(roles);
  const headers = [
    { id: "name", label: "Name" },
    { id: "description", label: "Description" },
  ];

  const onSubmitAdd = (e) => {
    e.preventDefault();

    dispatch(createRole(role));
    setState({ name: "", description: "", permissions: [] });
  };

  const handleEditClick = (id) => {
    setEdit({ _id: id, isEdited: true });
  };

  const handleCancelClick = () => {
    setEdit({ _id: "", isEdited: false });
  };

  const onChange = (e) => {
    setState({
      ...role,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    if (rolesStatus === Status.Success) {
      setSortedRoles(roles);
    }
  }, [roles, rolesStatus]);

  const setSortOrderBy = (property) => (event) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setSortedRoles(
      [...sortedRoles].sort((a, b) => {
        if (b[property] < a[property]) {
          return order === "asc" ? -1 : 1;
        }
        if (b[property] > a[property]) {
          return order === "asc" ? 1 : -1;
        }
        return 0;
      })
    );
  };

  if (status === Status.Loading || status === Status.Idle) {
    return <CircularProgress />;
  }

  return (
    <>
      {roles.length > 0 &&
      status === Status.Success &&
      rolesStatus === Status.Success ? (
        <TableContainer component={Paper} sx={{ my: 3, width: "auto" }}>
          <Table
            sx={{ overflowX: "auto", minWidth: "800px" }}
            aria-label="permissions table">
            <TableHead>
              <TableRow key="head">
                {headers.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}>
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={setSortOrderBy(headCell.id)}>
                      {headCell.label}
                      {orderBy === headCell.id && (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      )}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Permissions</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRoles.map((role) => (
                <TableRow key={role._id}>
                  {editRole.isEdited && editRole._id === role._id ? (
                    <EditableRow
                      role={role}
                      permissions={permissions}
                      getPermissions={getPermissions}
                      setEdit={setEdit}
                      handleCancelClick={handleCancelClick}
                    />
                  ) : (
                    <ReadOnlyRow
                      role={role}
                      permissions={permissions}
                      handleEditClick={handleEditClick}
                      deleteAction={deleteRole}
                    />
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h4" component="h2">
          You haven't set any role
        </Typography>
      )}

      <Typography variant="h3" component="h1">
        Add a Role
      </Typography>
      <Paper elevation={0} sx={{ mx: "auto", maxWidth: "1000px" }}>
        <form onSubmit={onSubmitAdd}>
          <TextField
            id="name"
            name="name"
            label="Name:"
            placeholder="Enter name"
            onChange={(e) => onChange(e)}
            required={true}
            size="medium"
            fullWidth
            sx={{ my: 1 }}
            value={role.name}
          />
          <TextField
            id="description"
            name="description"
            label="Description:"
            placeholder="Enter description"
            onChange={(e) => onChange(e)}
            size="medium"
            fullWidth
            sx={{ my: 1 }}
            value={role.description}
          />
          <CustomSelect
            id="permissions"
            label="Select permissions"
            items={permissions.map((p) => {
              return { _id: p._id, title: p.name };
            })}
            formData={role}
            setFormData={setState}
            multiple={true}
            selectedItems={permissions
              .filter((p) => role.permissions.includes(p._id))
              .map((p) => {
                return { _id: p._id, title: p.name };
              })}
          />
          <Button
            type="submit"
            size="large"
            variant="outlined"
            fullWidth
            sx={{ my: 1 }}>
            Add
          </Button>
        </form>
      </Paper>
    </>
  );
}

export default RoleTable;
