import CircularProgress from "@mui/material/CircularProgress"
import useGetData from "../hooks/useGetData"
import { Status } from "../features/Status"
import Button from "@mui/material/Button"
import {Link as ReactLink} from "react-router-dom"
import { getUsers, reset as resetUsers } from "../features/users/userSlice"

function UserNameLink({userId}) {
  const {users, status} = useGetData("users", getUsers, resetUsers, userId)

  if (status === Status.Loading || status === Status.Idle) {
    return <CircularProgress />
  }

  return (
    <Button component={ReactLink} to={"/users/" + userId} sx={{ color: '#fff' }}>{users[0].firstName + " " + users[0].lastName}</Button>
  )
}

export default UserNameLink