import {
  deleteCourse,
  getCourses,
  reset as resetCourses,
} from "../../features/courses/courseSlice";
import CustomCard from "../../components/CustomCard";
import Search from "../../components/Search";
import Typography from "@mui/material/Typography";
import useGetData from "../../hooks/useGetData";
import { Status } from "../../features/Status";
import CircularProgress from "@mui/material/CircularProgress";
import CreateNewEntryLink from "../../components/form/CreateNewEntryLink";
import Grid from "@mui/material/Unstable_Grid2";

function Courses() {
  const { courses, status } = useGetData("courses", getCourses, resetCourses);

  return (
    <>
      <Typography variant="h2">Courses Dashboard</Typography>
      <Search getData={getCourses} resetData={resetCourses} />
      <CreateNewEntryLink
        linkText="Create new Course"
        linkTo="/courses/create"
        perm="courseCreate"
      />

      {status === Status.Loading ? (
        <CircularProgress />
      ) : courses.length > 0 ? (
        <Grid container spacing={3} justifyContent="space-evenly">
          {courses.map((course) => (
            <Grid key={course._id}>
              <CustomCard
                data={course}
                link="/courses/"
                deleteAction={deleteCourse}
                deletePerm="courseDelete"
                editPerm="courseUpdate"
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h3">
          You are not enrolled in any courses
        </Typography>
      )}
    </>
  );
}

export default Courses;
