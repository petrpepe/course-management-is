import { useSelector } from "react-redux";
import {
  deleteClass,
  getClasses,
  reset as resetClasses,
} from "../features/classes/classSlice";
import CustomCard from "../components/CustomCard";
import { Status } from "../features/Status";
import useGetData from "../hooks/useGetData";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const { classes, status } = useGetData("classes", getClasses, resetClasses);

  return (
    <>
      <Typography variant="h3" component="h1">
        Welcome {user && user.firstName + " " + user.lastName}
      </Typography>
      <Typography variant="h4" component="h2">
        Main Dashboard
      </Typography>

      {classes.length > 0 && status === Status.Success ? (
        <Grid container spacing={3} justifyContent="space-evenly">
          {classes.map((classVar) => (
            <Grid key={classVar._id}>
              <CustomCard
                data={classVar}
                link="/classes/"
                deleteAction={deleteClass}
                deletePerm="classDelete"
                editPerm="classUpdate"
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h4" component="h2">
          You don't have any class today
        </Typography>
      )}
    </>
  );
}

export default Dashboard;
