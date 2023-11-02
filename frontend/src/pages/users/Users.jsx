import {
  deleteUser,
  getUsers,
  reset as resetUsers,
} from "../../features/users/userSlice";
import CustomCard from "../../components/CustomCard";
import Typography from "@mui/material/Typography";
import useGetData from "../../hooks/useGetData";
import { Status } from "../../features/Status";
import CircularProgress from "@mui/material/CircularProgress";
import Search from "../../components/Search";
import CreateNewEntryLink from "../../components/form/CreateNewEntryLink";
import Grid from "@mui/material/Unstable_Grid2";

function Users() {
  const { users, status } = useGetData("users", getUsers, resetUsers);

  return (
    <>
      <Typography variant="h2">Users Dashboard</Typography>
      <Search getData={getUsers} resetData={resetUsers} />
      <CreateNewEntryLink
        linkText="Register new User"
        linkTo="/users/create"
        perm="userCreate"
      />

      {status === Status.Loading ? (
        <CircularProgress />
      ) : users.length > 0 ? (
        <Grid container spacing={3} justifyContent="space-evenly">
          {users.map((u) => (
            <Grid key={u._id}>
              <CustomCard
                data={u}
                title={u.firstName + " " + u.lastName}
                desc={u.email}
                link="/users/"
                deleteAction={deleteUser}
                deletePerm="userDelete"
                editPerm="userUpdate"
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h3">There are no users</Typography>
      )}
    </>
  );
}

export default Users;
