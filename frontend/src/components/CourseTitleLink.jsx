import CircularProgress from "@mui/material/CircularProgress";
import useGetData from "../hooks/useGetData";
import {
  getCourses,
  reset as resetCourses,
} from "../features/courses/courseSlice";
import { Status } from "../features/Status";
import Button from "@mui/material/Button";
import { Link as ReactLink } from "react-router-dom";

function CourseTitleLink({ courseId }) {
  const { courses, status } = useGetData("courses", getCourses, resetCourses, {
    ids: courseId,
  });

  if (status === Status.Loading || status === Status.Idle) {
    return <CircularProgress />;
  }

  return (
    <Button
      component={ReactLink}
      to={"/courses/" + courseId}
      sx={{ color: "#fff" }}>
      {courses[0].title}
    </Button>
  );
}

export default CourseTitleLink;
