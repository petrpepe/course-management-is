import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getEnrollments,
  reset as resetEnrollments,
} from "../features/enrollments/enrollmentSlice";
import {
  getClasses,
  reset as resetClasses,
} from "../features/classes/classSlice";
import useGetData from "../hooks/useGetData";
import Typography from "@mui/material/Typography";
import Timetable from "../components/table/Timetable";
import { Status } from "../features/Status";
import LoadingOrError from "../components/LoadingOrError";
import CustomSelect from "../components/form/CustomSelect";
import { getUsers, reset as resetUsers } from "../features/users/userSlice";

function TimetablePage() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  const { enrollments, status: enrollmentStatus } = useGetData(
    "enrollments",
    getEnrollments,
    resetEnrollments,
    { ids: id || user._id }
  );
  const { classes, status: classStatus } = useGetData(
    "classes",
    getClasses,
    resetClasses,
    {
      ids: id || enrollments.map((e) => e.classId),
    }
  );

  const userIds = new Set([
    ...classes.map((c) => c.lectors),
    ...enrollments.map((e) => e.students),
  ]);

  if (classStatus === Status.Success) {
    return (
      <>
        <Typography variant="h3" component="h1">
          Rozvrh
        </Typography>
        <Timetable classes={classes} userIds={userIds} />
      </>
    );
  } else
    return (
      <>
        <LoadingOrError status={classStatus} />
        <LoadingOrError status={enrollmentStatus} />
      </>
    );
}

export default TimetablePage;
