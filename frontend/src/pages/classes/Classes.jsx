import {
  deleteClass,
  getClasses,
  reset as resetClasses,
} from "../../features/classes/classSlice";
import {
  getCourses,
  reset as resetCourses,
} from "../../features/courses/courseSlice";
import CustomCard from "../../components/CustomCard";
import Search from "../../components/Search";
import { Status } from "../../features/Status";
import useGetData from "../../hooks/useGetData";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ActionPermLink from "../../components/form/ActionPermLink";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import { Link as ReactLink } from "react-router-dom";
import Box from "@mui/material/Box";

function Classes() {
  const { classes, status } = useGetData("classes", getClasses, resetClasses);
  const { courses, status: courseStatus } = useGetData(
    "courses",
    getCourses,
    resetCourses,
    { ids: classes.map((c) => c.course) }
  );

  return (
    <>
      <Typography variant="h2">Classes Dashboard</Typography>
      <Search getData={getClasses} resetData={resetClasses} />
      <ActionPermLink
        linkText="Create new Class"
        linkTo="/classes/create"
        perm="classCreate"
      />

      {status === Status.Loading || courseStatus === Status.Loading ? (
        <CircularProgress />
      ) : classes.length > 0 ? (
        courses.map((c) => (
          <Box
            sx={{ border: 1, px: 2, pb: 2, pt: 1, borderRadius: 1 }}
            key={c._id}>
            <Button
              component={ReactLink}
              to={"/courses/" + c._id}
              sx={{ mb: 1 }}>
              {c.title}
            </Button>
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
          </Box>
        ))
      ) : (
        <Typography variant="h3">
          You are not enrolled in any classes
        </Typography>
      )}
    </>
  );
}

export default Classes;
