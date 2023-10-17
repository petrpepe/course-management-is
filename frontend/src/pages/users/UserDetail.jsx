import {useParams, Link as ReactLink} from "react-router-dom"
import {getUsers, reset as resetUsers} from "../../features/users/userSlice"
import CircularProgress from "@mui/material/CircularProgress"
import useGetData from "../../hooks/useGetData"
import { Status } from "../../features/Status"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

function UserDetail() {
  const { id } = useParams()
  const { users, status, message } = useGetData("users", getUsers, resetUsers, id, true)

  if (status === Status.Loading || status === Status.Idle) {
    return <CircularProgress />
  }

  if (status === Status.Error) {
    return console.log(message);
  }

  const currentUser = users[0]

  return (<>
    <Typography variant="h2">{id ? "Profile: " + currentUser.firstName + " " + currentUser.lastName : "Your profile"}</Typography>
    <Typography variant="h3">Whole name: {currentUser.firstName + (currentUser.otherNames && " " + currentUser.otherNames.join(" ") + " ") + currentUser.lastName}</Typography>
    <Typography variant="h4">Email: {currentUser.email}</Typography>
    <Typography variant="body1">Phones</Typography>
    {currentUser.phone.map(phone => <Typography variant="body1" key={phone._id}>{" " + phone.type + ": " + phone.number}</Typography>)}
    <Button component={ReactLink} to={"/users/" + currentUser._id + "/edit"} sx={{ my: 1 }}>Edit</Button>
  </>)
}

export default UserDetail