import {useEffect, useState} from "react"
import {useSelector, useDispatch} from "react-redux"
import Spinner from "../components/Spinner"
import {getPermissions,} from "../features/permissions/permissionSlice"
import { Status } from "../features/Status"
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

function Permissions() {
  const dispatch = useDispatch()

  const { permissions, status, message } = useSelector((state) => state.permissions)
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [sortedPermissions, setSortedPermissions] = useState(permissions);
  const headers = [{id: "name", label: "Name"}, {id: "description", label: "Description"}]

  useEffect(() => {
    if(status === Status.Idle) {
      dispatch(getPermissions())
    }
    if (status === Status.Error) {
      //show msg
    }
    if (status === Status.Success) {
      setSortedPermissions(permissions)
    }
  }, [status, permissions, message, dispatch])

  const setSortOrderBy = (property) => (event) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setSortedPermissions([...sortedPermissions].sort((a, b) => {
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
    <>
      <section className="heading">
        <h1>Permissions Dashboard</h1>
      </section>

      <section className="content">
        {status === Status.Success ? (
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
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPermissions.map((perm) => (
                <TableRow key={perm.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell scope="row">{perm.name}</TableCell>
                  <TableCell>{perm.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        ) : ( 
          <h3>You haven't set any permission</h3> 
        )}
      </section>
    </>
  )
}

export default Permissions