import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { createRole, deleteRole, updateRole} from "../../features/roles/roleSlice"
import { getPermissions } from "../../features/permissions/permissionSlice"
import ReadOnlyRow from "./ReadOnlyRow"
import EditableRow from "./EditableRow"
import Spinner from "../Spinner"
import { Status } from "../../features/Status"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import CustomSelect from "../form/CustomSelect"
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

function RoleTable({roles, rolesStatus}) {
  const dispatch = useDispatch()
  
  const [role, setState] = useState({name: "", description: "", permissions: []})
  const [editRole, setEdit] = useState({_id: "", ...role, isEdited: false})
  const { permissions, status, message } = useSelector((state) => state.permissions)
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [sortedRoles, setSortedRoles] = useState(permissions);
  const headers = [{id: "name", label: "Name"}, {id: "description", label: "Description"}]

  const onSubmitAdd = e => {
    e.preventDefault()

    dispatch(createRole(role))
    setState({})
  }

  const onSubmitEdit = e => {
    e.preventDefault()

    dispatch(updateRole({_id: editRole._id, name: editRole.name, description: editRole.description, permissions: editRole.permissions ? editRole.permissions : []}))
    setEdit({_id: "",  role: {}, isEdited: false})
    setState({})
  }

  const handleEditClick = (id) => {
    setEdit({_id: id, role: role, isEdited: true})
  };

  const handleCancelClick = () => {
    setEdit({_id: "", role: {}, isEdited: false})
  };

  const onChange = e => {
    const inputName = e.target.name

    setState({
      ...role,
      [inputName]: e.target.value,
    })
  }

  useEffect(() => {
    if (status === Status.Idle) {
      dispatch(getPermissions())
    }
    if (rolesStatus === Status.Success) {
      setSortedRoles(roles)
    }
  }, [status, roles, rolesStatus, message, dispatch])

  
  const setSortOrderBy = (property) => (event) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setSortedRoles([...sortedRoles].sort((a, b) => {
      if (b[property] < a[property]) {
        return order === "asc" ? -1 : 1;
      }
      if (b[property] > a[property]) {
        return   order === "asc" ? 1 : -1;
      }
      return 0;
    }))
  }

  if (status === Status.Loading) {
    return <Spinner />
  }

  return (
  <div className="app-container">
    {roles.length > 0 && status === Status.Success && rolesStatus === Status.Success ? (
      <form onSubmit={onSubmitEdit}>
        <TableContainer component={Paper} sx={{mx: 3, width: "auto"}} >
          <Table sx={{ overflowX: "auto" }} size="small" aria-label="permissions table">
            <TableHead>
              <TableRow>
                {headers.map((headCell) => (
                <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={setSortOrderBy(headCell.id)}
                  >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>))}
                <TableCell>Permissions</TableCell>
                <TableCell align="center" >Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRoles.map((role) => <>
                {editRole.isEdited && editRole._id === role._id ? (
                  <EditableRow role={role} permissions={permissions} getPermissions={getPermissions} 
                  setEdit={setEdit} handleCancelClick={handleCancelClick} />
                ) : (
                  <ReadOnlyRow role={role} permissions={permissions} handleEditClick={handleEditClick} deleteAction={deleteRole} />
                )}
              </>)}
            </TableBody>
          </Table>
        </TableContainer>
      </form>
    ) : ( 
      <h3>You haven't set any role</h3> 
    )}

    <h2>Add a Role</h2>
    <form className="form" onSubmit={onSubmitAdd}>
      <TextField  id="name" name="name" label="Name:" placeholder="Enter name" onChange={(e) => onChange(e)} 
      required={true} size="medium" fullWidth sx={{my: 1}} />
      <TextField  id="description" name="description" label="Description:" placeholder="Enter description" onChange={(e) => onChange(e)} 
      size="medium" fullWidth sx={{my: 1}} />
      <CustomSelect id="permissions" label="Select permissions" items={permissions.map(p => {return {_id: p._id, title: p.name}})} getItems={getPermissions} itemsStatus={status}
        formData={role} setFormData={setState} multiple={true} />
      <Button type="submit" size="large" variant="outlined" fullWidth sx={{my: 1}} >Add</Button>
    </form>
  </div>
  );
};

export default RoleTable;