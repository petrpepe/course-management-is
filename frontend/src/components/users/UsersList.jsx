import CircularProgress from "@mui/material/CircularProgress";
import useGetData from "../../hooks/useGetData";
import { Status } from "../../features/Status";
import { Link as ReactLink } from "react-router-dom";
import { getUsers, reset as resetUsers } from "../../features/users/userSlice";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

function UsersList({ usersIds, heading }) {
  const { users, status } = useGetData("users", getUsers, resetUsers, {
    ids: usersIds,
  });

  if (status === Status.Loading || status === Status.Idle) {
    return <CircularProgress />;
  }

  const filtered = users.filter((u) => usersIds.includes(u._id));

  return (
    <>
      <Typography variant="h4" sx={{ my: 1 }}>
        List of {heading}
      </Typography>
      <List
        sx={{
          mb: 1,
          width: "100%",
          bgcolor: "background.paper",
          border: "1px solid",
        }}>
        {filtered.map((user, i) => (
          <ListItem
            key={user._id + i}
            sx={{
              width: { xs: "100%", md: "50%", lg: "33%" },
              display: "inline-block",
            }}>
            <ListItemButton component={ReactLink} to={"/users/" + user._id}>
              <ListItemText
                primary={user.firstName + ". " + user.lastName}
                secondary={user.email}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default UsersList;
