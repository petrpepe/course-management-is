import {
  deleteClass,
  getClasses,
  reset as resetClasses,
} from "../../features/classes/classSlice";
import CustomCard from "../../components/CustomCard";
import Search from "../../components/Search";
import { Status } from "../../features/Status";
import useGetData from "../../hooks/useGetData";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import CreateNewEntryLink from "../../components/form/CreateNewEntryLink";
import Grid from "@mui/material/Unstable_Grid2";

function Classes() {
  const { classes, status } = useGetData("classes", getClasses, resetClasses);

  return (
    <>
      <Typography variant="h2">Classes Dashboard</Typography>
      <Search getData={getClasses} resetData={resetClasses} />
      <CreateNewEntryLink
        linkText="Create new Class"
        linkTo="/classes/create"
        perm="classCreate"
      />

      {status === Status.Loading ? (
        <CircularProgress />
      ) : classes.length > 0 ? (
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
        <Typography variant="h3">
          You are not enrolled in any classes
        </Typography>
      )}
    </>
  );
}

export default Classes;
