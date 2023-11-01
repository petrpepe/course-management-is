import Typography from "@mui/material/Typography";
import { Status } from "../features/Status";
import {
  getClasses,
  reset as resetClasses,
} from "../features/classes/classSlice";
import {
  getLessons,
  reset as resetLessons,
} from "../features/lessons/lessonSlice";
import useGetData from "../hooks/useGetData";

function ClassLessonTitle({ classId, lessonId }) {
  const { classes, status: classStatus } = useGetData(
    "classes",
    getClasses,
    resetClasses,
    { ids: classId },
  );
  const { lessons, status: lessonStatus } = useGetData(
    "lessons",
    getLessons,
    resetLessons,
    { ids: lessonId, detail: true },
  );

  if (classStatus === Status.Success && lessonStatus === Status.Success) {
    const classVar = classes.filter((c) => c._id === classId)[0];
    const lesson = lessons.filter((l) => l._id === lessonId)[0];
    return (
      <>
        <Typography variant="h2" sx={{ display: "block", width: "100%" }}>
          {classVar.title + ": " + lesson.title}
        </Typography>
        <Typography variant="body1">{lesson.materials}</Typography>
      </>
    );
  }
}

export default ClassLessonTitle;
