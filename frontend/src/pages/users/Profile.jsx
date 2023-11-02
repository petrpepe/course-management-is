import { Link as ReactLink } from "react-router-dom";
//import {getUsers, reset as resetUsers} from "../../features/users/userSlice"
//import CircularProgress from "@mui/material/CircularProgress"
//import useGetData from "../../hooks/useGetData"
//import { Status } from "../../features/Status"
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";

function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Typography variant="h2">Your profile</Typography>
      <Typography variant="h3">
        Whole name:{" "}
        {user.firstName +
          (user.otherNames ? " " + user.otherNames.join(" ") + " " : " ") +
          user.lastName}
      </Typography>
      <Typography variant="h4">Email: {user.email}</Typography>
      <Typography variant="body1">Phones</Typography>
      {user.phone.map((phone) => (
        <Typography variant="body1" key={phone.type}>
          {" " + phone.type + ": " + phone.number}
        </Typography>
      ))}
      <Button
        component={ReactLink}
        to={"/users/" + user._id + "/edit"}
        sx={{ my: 1 }}>
        Edit
      </Button>
    </>
  );
}

export default Profile;
