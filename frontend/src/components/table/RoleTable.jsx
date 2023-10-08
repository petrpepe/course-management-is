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
    {roles.length > 0 ? (
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
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedRoles.map((role) => (
                        <TableRow key={role.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell scope="row">{role.name}</TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>{role.permissions.map(p => permissions.map(perm => {
                            if(p === perm._id) return perm.name
                            else return 0
                            }).filter(p => p !== 0)).join(", ")}</TableCell>
                          <TableCell>actions</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            {/*rolesStatus.Loading ? <Spinner /> : roles.map((role) => (
              <tr key={role._id}>
                { editRole.isEdited && editRole._id === role._id ? (
                  <EditableRow
                    data={role}
                    setEdit={setEdit}
                    handleCancelClick={handleCancelClick}
                    options={permissions.map(p => ({value: p._id, label: p.name}))}
                  />
                ) : (
                  <ReadOnlyRow
                    data={role}
                    handleEditClick={handleEditClick}
                    deleteAction={deleteRole}
                    dataArray={role.permissions.map(perm => {
                      const permName = permissions.map(p => ({value: p._id, label: p.name})).filter(opt => perm === opt.value)
                      if(permName.length > 0) return permName[0].label
                      else return ""
                    })}
                  />
                )}
              </tr>
            ))*/}
      </form>
    ) : ( 
      <h3>You haven't set any role</h3> 
    )}

    <h2>Add a Role</h2>
    <form className="form" onSubmit={onSubmitAdd}>
      <TextField  id="name" label="Name:" placeholder="Enter name" onChange={(e) => onChange(e)} 
      required={true} size="medium" fullWidth sx={{my: 1}} />
      <TextField  id="description" label="Description:" placeholder="Enter description" onChange={(e) => onChange(e)} 
      size="medium" fullWidth sx={{my: 1}} />
      <CustomSelect id="permissions" label="Select permissions" items={permissions} getItems={getPermissions} itemsStatus={status}
        formData={role} setFormData={setState} multiple={true} />
      <Button type="submit" size="large" variant="outlined" fullWidth sx={{my: 1}} >Add</Button>
    </form>
  </div>
  );
};

export default RoleTable;