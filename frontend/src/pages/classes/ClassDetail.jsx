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
import { getUsers, reset as resetUsers } from "../../features/users/userSlice";

function ClassDetail() {
  const { id } = useParams();
  let classItem = {
    _id: id,
    title: "",
    description: "",
    lectors: [],
    course: "",
  };
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

  const { users, status: userStatus } = useGetData(
    "users",
    getUsers,
    resetUsers,
    {
      ids:
        enrollments.length > 0
          ? enrollments[0].students.concat(classItem.lectors)
          : classItem.lectors,
    }
  );

  if (
    classStatus === Status.Loading ||
    enrollmentStatus === Status.Loading ||
    classStatus === Status.Idle
  ) {
    return <CircularProgress sx={{ position: "absolute", top: "50%" }} />;
  }

  classItem = classes.filter((c) => c._id === id)[0];

  return (
    <>
      <Typography variant="h2">Class: {classItem.title}</Typography>
      <Typography variant="h3">{classItem.description}</Typography>
      <CourseTitleLink courseId={classItem.course} />
      <Timetable classIds={id} classes={classes} />
      <UsersList
        users={users.filter((u) => enrollments[0].students.includes(u._id))}
        heading="students"
      />
      <UsersList
        users={users.filter((u) => classItem.lectors.includes(u._id))}
        heading="lectors"
      />
      <ActionPermLink
        linkText="Edit"
        linkTo={"/classes/" + classItem._id + "/edit"}
        perm="classUpdate"
      />
    </>
  );
}

export default ClassDetail;
