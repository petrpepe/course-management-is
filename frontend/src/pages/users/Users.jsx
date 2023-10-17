import {Link as ReactLink} from "react-router-dom"
import {useSelector} from "react-redux"
import {deleteUser, getUsers, reset as resetUsers} from "../../features/users/userSlice"
import CustomCard from "../../components/CustomCard"
import Typography from "@mui/material/Typography"
import useGetData from "../../hooks/useGetData"
import { Status } from "../../features/Status"
import CircularProgress from "@mui/material/CircularProgress"
import Button from "@mui/material/Button"
import Search from "../../components/Search"

function Users() {
  const { user } = useSelector((state) => state.auth)
  const { users, status } = useGetData("users", getUsers, resetUsers)

  return (<>
    <Typography variant="h2">Users Dashboard</Typography>
    <Search getData={getUsers} />
    {user.roles.includes("admin") && <Button component={ReactLink} to="/users/create" sx={{ color: '#fff' }}>Create new Lesson</Button>}

    {status === Status.Loading ? <CircularProgress /> : users.length > 0 ? (
      <div className="cards">
        {users.map((u) => (
          <CustomCard key={u._id} title={u.firstName + " " + u.lastName} desc={u.email} data={u} link="/users/" deleteAction={deleteUser} />
        ))}
      </div>
    ) : ( 
      <Typography variant="h3">There are no users</Typography> 
    )}
  </>)
}

export default Users