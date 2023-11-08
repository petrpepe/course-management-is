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
import { Status } from "../../features/Status";
import { useEffect, useState } from "react";

function AttendanceTable({ attendances = [], title, status }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [sortedAtts, setSortedAtts] = useState(attendances);
  const headers = [
    { id: "name", label: "Name" },
    { id: "description", label: "Description" },
  ];

  useEffect(() => {
    if (status === Status.Success) {
      setSortedAtts(attendances);
    }
  }, [status, attendances]);

  const setSortOrderBy = (property) => (event) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setSortedAtts(
      [...sortedAtts].sort((a, b) => {
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

  return (
    <>
      <Typography variant="h2">Permissions Dashboard</Typography>

      <TableContainer component={Paper} sx={{ mx: 3, width: "auto" }}>
        <Table
          sx={{ overflowX: "auto" }}
          size="small"
          aria-label="permissions table">
          <TableHead>
            <TableRow>
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
            {sortedAtts.map((perm) => (
              <TableRow
                key={perm.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell scope="row">{perm.name}</TableCell>
                <TableCell>{perm.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default AttendanceTable;
