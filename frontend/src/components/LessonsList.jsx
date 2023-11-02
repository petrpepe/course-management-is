import CircularProgress from "@mui/material/CircularProgress";
import useGetData from "../hooks/useGetData";
import { Status } from "../features/Status";
import { Link as ReactLink } from "react-router-dom";
import {
  getLessons,
  reset as resetLessons,
} from "../features/lessons/lessonSlice";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

function LessonsList({ courseId }) {
  const { lessons, status } = useGetData("lessons", getLessons, resetLessons, {
    courseId,
  });

  if (status === Status.Loading) {
    return <CircularProgress />;
  }

  if (status === Status.Success) {
    return (
      <>
        <Typography variant="h4" sx={{ my: 1 }}>
          List of lessons
        </Typography>
        <List
          sx={{
            mb: 1,
            width: "100%",
            bgcolor: "background.paper",
            border: "1px solid",
          }}>
          {lessons.map((lesson) => (
            <ListItem
              key={lesson._id}
              sx={{
                width: { xs: "100%", md: "50%", lg: "33%" },
                display: "inline-block",
              }}>
              <ListItemButton
                component={ReactLink}
                to={"/lessons/" + lesson._id}>
                <ListItemText
                  primary={lesson.lessonNum + ". " + lesson.title}
                  secondary={lesson.description}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </>
    );
  }
}

export default LessonsList;
