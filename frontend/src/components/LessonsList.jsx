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
import Box from "@mui/material/Box";

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
        <Typography variant="h4" component="h2" sx={{ my: 1 }}>
          List of lessons
        </Typography>
        <Box
          sx={{
            m: 1,
            margin: "auto",
            width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
            display: "block",
          }}>
          <List
            sx={{
              mb: 1,
              bgcolor: "background.paper",
              border: "1px solid",
              margin: "auto",
            }}>
            {lessons.map((lesson) => (
              <ListItem
                key={lesson._id}
                sx={{
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
        </Box>
      </>
    );
  }
}

export default LessonsList;
