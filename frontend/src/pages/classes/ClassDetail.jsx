import { useParams } from "react-router-dom";
import {
  getClasses,
  reset as resetClasses,
} from "../../features/classes/classSlice";
import { Status } from "../../features/Status";
import Typography from "@mui/material/Typography";
import useGetData from "../../hooks/useGetData";
import CourseTitleLink from "../../components/CourseTitleLink";
import CircularProgress from "@mui/material/CircularProgress";
import {
  getEnrollments,
  reset as resetEnrollments,
} from "../../features/enrollments/enrollmentSlice";
import UsersList from "../../components/users/UsersList";
import Timetable from "../../components/table/Timetable";
import ActionPermLink from "../../components/form/ActionPermLink";

function ClassDetail() {
  const { id } = useParams();
  const { classes, status: classStatus } = useGetData(
    "classes",
    getClasses,
    resetClasses,
    { ids: id }
  );
  const { enrollments, status: enrollmentStatus } = useGetData(
    "enrollments",
    getEnrollments,
    resetEnrollments,
    { ids: id }
  );

  if (
    classStatus === Status.Loading ||
    enrollmentStatus === Status.Loading ||
    classStatus === Status.Idle
  ) {
    return <CircularProgress sx={{ position: "absolute", top: "50%" }} />;
  }

  return (
    <>
      <Typography variant="h2">Class: {classes[0].title}</Typography>
      <Typography variant="h3">{classes[0].description}</Typography>
      <CourseTitleLink courseId={classes[0].course} />
      <Timetable classIds={id} classes={classes} />
      <UsersList
        usersIds={enrollments.flatMap((e) => e.student)}
        heading="students"
      />
      <UsersList usersIds={classes[0].lectors} heading="lectors" />
      <ActionPermLink
        linkText="Edit"
        linkTo={"/classes/" + classes[0]._id + "/edit"}
        perm="classUpdate"
      />
    </>
  );
}

export default ClassDetail;
