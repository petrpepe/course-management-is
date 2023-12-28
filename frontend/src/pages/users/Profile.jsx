import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import ActionPermLink from "../../components/form/ActionPermLink";

function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Typography variant="h3" component="h1">
        Your profile
      </Typography>
      <Typography variant="h4" component="h2">
        Whole name:{" "}
        {user.firstName +
          (user.otherNames ? " " + user.otherNames.join(" ") + " " : " ") +
          user.lastName}
      </Typography>
      <Typography variant="h4" component="h2">
        Email: {user.email}
      </Typography>
      <Typography variant="body1">Phones</Typography>
      {user.phone.map((phone) => (
        <Typography variant="body1" key={phone.type}>
          {" " + phone.type + ": " + phone.number}
        </Typography>
      ))}
      <ActionPermLink
        linkText="Edit"
        linkTo={"/users/" + user._id + "/edit"}
        perm="userUpdate"
      />
    </>
  );
}

export default Profile;
