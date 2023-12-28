import {
  deleteClass,
  getClasses,
  reset as resetClasses,
} from "../../features/classes/classSlice";
import {
  getTimetables,
  reset as resetTimetables,
} from "../../features/timetables/timetableSlice";
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
import { closestTo, parseISO } from "date-fns/esm";

function Classes() {
  const { classes, status: classStatus } = useGetData(
    "classes",
    getClasses,
    resetClasses
  );
  const { timetables, status: timetableStatus } = useGetData(
    "timetables",
    getTimetables,
    resetTimetables,
    { ids: classes.map((c) => c._id) }
  );
  const { courses, status: courseStatus } = useGetData(
    "courses",
    getCourses,
    resetCourses,
    { ids: classes.map((c) => c.course) }
  );

  const today = new Date();
  const sortedClasses = classes.slice(0).sort((a, b) => {
    const aTimetables = timetables.filter(
      (t) => t.classId === a._id && new Date(t.datetime) > today
    );
    const bTimetables = timetables.filter(
      (t) => t.classId === b._id && new Date(t.datetime) > today
    );
    const aStart = closestTo(
      today,
      aTimetables.map((t) => parseISO(t.datetime))
    );
    const bStart = closestTo(
      today,
      bTimetables.map((t) => parseISO(t.datetime))
    );

    if (aTimetables.length === 0 && bTimetables.length === 0) return 0;
    else if (aTimetables.length > 0 && bTimetables.length === 0) return -1;
    else if (aTimetables.length === 0 && bTimetables.length > 0) return 1;
    else return aStart - bStart;
  });

  return (
    <>
      <Typography variant="h3" component="h1">
        Classes Dashboard
      </Typography>
      <Search getData={getClasses} resetData={resetClasses} />
      <ActionPermLink
        linkText="Create new Class"
        linkTo="/classes/create"
        perm="classCreate"
      />

      {classStatus === Status.Loading || courseStatus === Status.Loading ? (
        <CircularProgress />
      ) : sortedClasses.length > 0 ? (
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
              {sortedClasses.map((classVar) => (
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
        <Typography variant="h4" component="h2">
          You are not enrolled in any classes
        </Typography>
      )}
    </>
  );
}

export default Classes;
