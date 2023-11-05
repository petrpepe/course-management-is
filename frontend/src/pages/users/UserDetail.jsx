import { useParams } from "react-router-dom";
import { getUsers, reset as resetUsers } from "../../features/users/userSlice";
import CircularProgress from "@mui/material/CircularProgress";
import useGetData from "../../hooks/useGetData";
import { Status } from "../../features/Status";
import Typography from "@mui/material/Typography";
import ActionPermLink from "../../components/form/ActionPermLink";
import { useSelector } from "react-redux";

function UserDetail() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { users, status, message } = useGetData("users", getUsers, resetUsers, {
    ids: id,
    detail: true,
  });

  if (status === Status.Loading || status === Status.Idle) {
    return <CircularProgress />;
  }

  if (status === Status.Error) {
    return console.log(message);
  }

  const currentUser = users[0];

  return (
    <>
      <Typography variant="h2">
        {id
          ? "Profile: " + currentUser.firstName + " " + currentUser.lastName
          : "Your profile"}
      </Typography>
      <Typography variant="h3">
        Whole name:{" "}
        {currentUser.firstName +
          (currentUser.otherNames &&
            " " + currentUser.otherNames.join(" ") + " ") +
          currentUser.lastName}
      </Typography>
      <Typography variant="h4">Email: {currentUser.email}</Typography>
      <Typography variant="body1">Phones</Typography>
      {currentUser.phone.map((phone) => (
        <Typography variant="body1" key={phone.type}>
          {" " + phone.type + ": " + phone.number}
        </Typography>
      ))}
      {user.roles.includes("admin") && (
        <ActionPermLink
          linkText="Edit"
          linkTo={"/users/" + currentUser._id + "/edit"}
          perm="userUpdate"
        />
      )}
    </>
  );
}

export default UserDetail;
