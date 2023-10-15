import {Link} from "react-router-dom"
import {useSelector} from "react-redux"
import {deleteUser, getUsers, reset as resetUsers} from "../../features/users/userSlice"
import CustomCard from "../../components/CustomCard"
import Typography from "@mui/material/Typography"
import useGetData from "../../hooks/useGetData"
import { Status } from "../../features/Status"
import CircularProgress from "@mui/material/CircularProgress"

function Users() {
  const { user } = useSelector((state) => state.auth)
  const { users, status } = useGetData("users", getUsers, resetUsers)

  return (
    <>
      <section className="heading">
        <Typography variant="h2">Users Dashboard</Typography>
      </section>

      <section className="content">
        {user.roles.includes("admin") ? <Link to={"/users/create"}>Create new User</Link> : null}
        {status === Status.Loading ? <CircularProgress /> : users.length > 0 ? (
          <div className="cards">
            {users.map((user) => (
              <CustomCard key={user._id} data={user} title={user.lastName + " " + user.firstName} link="/users/" deleteAction={deleteUser} />
            ))}
          </div>
        ) : ( 
          <Typography variant="h3">You haven't set any user</Typography> 
        )}
      </section>
    </>
  )
}

export default Users