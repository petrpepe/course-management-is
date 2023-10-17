import CircularProgress from "@mui/material/CircularProgress"
import useGetData from "../hooks/useGetData"
import { Status } from "../features/Status"
import {Link as ReactLink} from "react-router-dom"
import { getUsers, reset as resetUsers } from "../features/users/userSlice"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"

function UsersList({usersIds}) {
  const {users, status} = useGetData("users", getUsers, resetUsers, usersIds)

  if (status === Status.Loading || status === Status.Idle) {
    return <CircularProgress />
  }

  return (<>
    <Typography variant="h4" sx={{my: 1}}>List of students</Typography>
    <List sx={{mb: 1, width: '100%', bgcolor: 'background.paper', border: "1px solid" }}>
      {users.map(user => (
        <ListItem key={user._id} sx={{width: {xs: "100%", md: "50%",lg: "33%"}, display: "inline-block"}}>
          <ListItemButton component={ReactLink} to={"/users/" + user._id} sx={{ color: '#fff' }}>
            <ListItemText primary={user.firstName + ". " + user.lastName} secondary={user.email} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </>)
}

export default UsersList