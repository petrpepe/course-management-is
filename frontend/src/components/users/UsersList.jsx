import { Link as ReactLink } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function UsersList({ users = [], heading }) {
  return (
    <>
      <Typography variant="h4" component="h2" sx={{ my: 1 }}>
        List of {heading}
      </Typography>
      <Box
        sx={{
          m: 1,
          margin: "auto",
          width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
          display: "block",
        }}>
        <List
          sx={{
            mb: 1,
            bgcolor: "background.paper",
            border: "1px solid",
            margin: "auto",
          }}>
          {users.length === 0 ? (
            <Typography variant="h5" sx={{ my: 1 }}>
              No {heading}
            </Typography>
          ) : (
            users.map((user, i) => (
              <ListItem
                key={user._id + i}
                sx={{
                  display: "block",
                }}>
                <ListItemButton component={ReactLink} to={"/users/" + user._id}>
                  <ListItemText
                    primary={user.firstName + ". " + user.lastName}
                    secondary={user.email}
                  />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Box>
    </>
  );
}

export default UsersList;
