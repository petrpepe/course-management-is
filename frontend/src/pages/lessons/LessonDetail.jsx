import { useParams } from "react-router-dom";
import {
  getLessons,
  reset as resetLessons,
} from "../../features/lessons/lessonSlice";
import { Status } from "../../features/Status";
import Typography from "@mui/material/Typography";
import useGetData from "../../hooks/useGetData";
import CourseTitleLink from "../../components/CourseTitleLink";
import CircularProgress from "@mui/material/CircularProgress";
import ActionPermLink from "../../components/form/ActionPermLink";

function LessonDetail() {
  const { id } = useParams();
  const { lessons, status } = useGetData("lessons", getLessons, resetLessons, {
    ids: id,
    detail: true,
  });

  if (status === Status.Loading || status === Status.Idle) {
    return <CircularProgress />;
  }

  const lesson = lessons.filter((l) => l._id === id)[0];

  if (status === Status.Success && lesson.content === undefined) {
    return <CircularProgress />;
  }

  return (
    <>
      <Typography variant="h3" component="h1">
        Lesson {lesson.lessonNum}: {lessons.title}
      </Typography>
      <Typography variant="h4" component="h2">
        {lesson.description}
      </Typography>
      <CourseTitleLink courseId={lesson.course} />
      <Typography variant="body1" fontSize="large">
        {lesson.materials}
      </Typography>
      {lesson.content.split("\\n").map((c, i) => (
        <Typography
          key={i}
          variant="body1"
          fontSize="large"
          textAlign="left"
          sx={{ m: 1.5 }}>
          {c}
        </Typography>
      ))}
      <ActionPermLink
        linkText="Edit"
        linkTo={"/lessons/" + lesson._id + "/edit"}
        perm="lessonUpdate"
      />
    </>
  );
}

export default LessonDetail;
