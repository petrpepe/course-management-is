import { useEffect, useState } from "react";
import {
  getPermissions,
  reset as resetPermissions,
} from "../features/permissions/permissionSlice";
import { Status } from "../features/Status";
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
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import useGetData from "../hooks/useGetData";

function Permissions() {
  const { permissions, status } = useGetData(
    "permissions",
    getPermissions,
    resetPermissions,
  );
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [sortedPermissions, setSortedPermissions] = useState(permissions);
  const headers = [
    { id: "name", label: "Name" },
    { id: "description", label: "Description" },
  ];

  useEffect(() => {
    if (status === Status.Success) {
      setSortedPermissions(permissions);
    }
  }, [status, permissions]);

  const setSortOrderBy = (property) => (event) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setSortedPermissions(
      [...sortedPermissions].sort((a, b) => {
        if (b[property] < a[property]) {
          return order === "asc" ? -1 : 1;
        }
        if (b[property] > a[property]) {
          return order === "asc" ? 1 : -1;
        }
        return 0;
      }),
    );
  };

  if (status === Status.Loading || status === Status.Idle) {
    return <CircularProgress />;
  }

  return (
    <>
      <Typography variant="h2">Permissions Dashboard</Typography>

      {permissions.length > 0 ? (
        <TableContainer component={Paper} sx={{ mx: 3, width: "auto" }}>
          <Table
            sx={{ overflowX: "auto" }}
            size="small"
            aria-label="permissions table"
          >
            <TableHead>
              <TableRow>
                {headers.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={setSortOrderBy(headCell.id)}
                    >
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
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPermissions.map((perm) => (
                <TableRow
                  key={perm.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell scope="row">{perm.name}</TableCell>
                  <TableCell>{perm.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h3">You haven't set any permission</Typography>
      )}
    </>
  );
}

export default Permissions;
