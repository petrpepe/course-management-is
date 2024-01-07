import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import {
  createLesson,
  getLessons,
  updateLesson,
  reset as resetLessons,
} from "../../features/lessons/lessonSlice";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CustomSelect from "../../components/form/CustomSelect";
import {
  getCourses,
  reset as resetCourses,
} from "../../features/courses/courseSlice";
import Typography from "@mui/material/Typography";
import useGetData from "../../hooks/useGetData";
import LoadingOrError from "../../components/LoadingOrError";
import { Status } from "../../features/Status";
import Paper from "@mui/material/Paper";

function LessonAction() {
  const [isCreated, setIsCreated] = useState(false);
  const [formData, setFormData] = useState({
    lessonNum: 1,
    title: "",
    description: "",
    materials: "",
    duration: 60,
    course: "",
    content: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const { lessons, status: lessonStatus } = useGetData(
    "lessons",
    getLessons,
    resetLessons,
    {
      ids: id,
      detail: true,
    }
  );
  const { courses, status: courseStatus } = useGetData(
    "courses",
    getCourses,
    resetCourses
  );

  useEffect(() => {
    if (
      id &&
      lessonStatus === Status.Success &&
      (lessons.filter((l) => l._id === id)[0].content ||
        lessons.filter((l) => l._id === id)[0].content === "")
    )
      setFormData(lessons.filter((l) => l._id === id)[0]);
  }, [id, lessonStatus, lessons]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const lessonData = {
      ...formData,
      content: formData.content.replace(/\n/g, "\\n"),
    };
    if (id) {
      dispatch(updateLesson(lessonData));
      navigate("/lessons/" + id);
    } else {
      dispatch(createLesson(lessonData));
      setIsCreated(true);
    }
  };

  if (isCreated && lessonStatus === Status.Success) {
    return navigate("/lessons/" + lessons[lessons.length - 1]._id);
  }

  if (
    lessonStatus === Status.Loading ||
    lessonStatus === Status.Idle ||
    courseStatus === Status.Loading ||
    courseStatus === Status.Idle
  ) {
    return <LoadingOrError status={Status.Loading} />;
  }

  return (
    <Paper elevation={0} sx={{ my: 5, mx: "auto", maxWidth: "1000px" }}>
      <Typography variant="h3" component="h1">
        <SchoolIcon fontSize="large" />{" "}
        {id ? "Editing lesson: " + formData.title : "Create lesson"}
      </Typography>
      <form onSubmit={onSubmit}>
        <TextField
          id="lessonNum"
          name="lessonNum"
          label="lessonNum:"
          value={formData.lessonNum}
          type="number"
          onChange={(e) => onChange(e)}
          required={true}
          InputProps={{ inputProps: { min: 1 } }}
          size="medium"
          fullWidth
          sx={{ my: 1 }}
        />
        <TextField
          id="title"
          name="title"
          label="Title:"
          value={formData.title}
          placeholder="Enter title"
          onChange={(e) => onChange(e)}
          required={true}
          size="medium"
          fullWidth
          sx={{ my: 1 }}
        />
        <TextField
          id="description"
          name="description"
          label="Description:"
          value={formData.description}
          placeholder="Enter description"
          onChange={(e) => onChange(e)}
          size="medium"
          fullWidth
          sx={{ my: 1 }}
        />
        <TextField
          id="materials"
          name="materials"
          label="Materials:"
          value={formData.materials}
          placeholder="Enter materials"
          onChange={(e) => onChange(e)}
          size="medium"
          fullWidth
          sx={{ my: 1 }}
        />
        <TextField
          id="duration"
          name="duration"
          label="Duration:"
          value={formData.duration}
          type="number"
          InputProps={{ inputProps: { min: 1 } }}
          onChange={(e) => onChange(e)}
          size="medium"
          fullWidth
          sx={{ my: 1 }}
        />
        <CustomSelect
          id="course"
          label="Select course"
          items={courses.map((c) => {
            return { _id: c._id, title: c.title };
          })}
          formData={formData}
          setFormData={setFormData}
          multiple={false}
          selectedItems={
            courses
              .filter((c) => c._id === formData.course)
              .map((c) => {
                return { _id: c._id, title: c.title };
              })[0]
          }
        />
        <TextField
          id="content"
          name="content"
          label="Content:"
          value={formData.content.replace(/\\n/g, "\n")}
          multiline
          minRows={10}
          maxRows={30}
          onChange={(e) => onChange(e)}
          size="medium"
          fullWidth
          sx={{ my: 1 }}
        />
        <Button
          type="submit"
          size="large"
          variant="outlined"
          fullWidth
          sx={{ my: 1 }}>
          Submit
        </Button>
      </form>
    </Paper>
  );
}

export default LessonAction;
