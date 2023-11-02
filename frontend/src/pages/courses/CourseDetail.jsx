import { useParams } from "react-router-dom";
import {
  getCourses,
  reset as resetCourses,
} from "../../features/courses/courseSlice";
import useGetData from "../../hooks/useGetData";
import { Status } from "../../features/Status";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import UserNameLink from "../../components/users/UserNameLink";
import LessonsList from "../../components/LessonsList";
import ActionPermLink from "../../components/form/ActionPermLink";

function CourseDetail() {
  const { id } = useParams();
  const { courses, status, message } = useGetData(
    "courses",
    getCourses,
    resetCourses,
    { ids: id }
  );

  if (status === Status.Loading) {
    return <CircularProgress />;
  }

  if (status === Status.Error) {
    console.log(message);
  }

  if (status === Status.Success) {
    const course = courses[0];
    return (
      <>
        <Typography variant="h2">Course {course.title}</Typography>
        <Typography variant="subtitle1">
          Academic term {course.academicTerm}
        </Typography>
        <Typography variant="subtitle1">{course.description}</Typography>
        <UserNameLink userId={course.owner} />
        <LessonsList courseId={course._id} />
        <ActionPermLink
          linkText="Edit"
          linkTo={"/courses/" + course._id + "/edit"}
          perm="courseUpdate"
        />
      </>
    );
  }
}

export default CourseDetail;
