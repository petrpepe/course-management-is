import { Link as ReactLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  deleteLesson,
  getLessons,
  reset as resetLessons,
} from "../../features/lessons/lessonSlice";
import CustomCard from "../../components/CustomCard";
import { Status } from "../../features/Status";
import useGetData from "../../hooks/useGetData";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Search from "../../components/Search";

function Lessons() {
  const { user } = useSelector((state) => state.auth);
  const { lessons, status } = useGetData("lessons", getLessons, resetLessons);

  return (
    <>
      <Typography variant="h2">Lessons Dashboard</Typography>
      <Search getData={getLessons} resetData={resetLessons} />
      {(user.roles.includes("admin") || user.roles.includes("lector")) && (
        <Button
          component={ReactLink}
          to="/lessons/create"
          sx={{ color: "#fff" }}>
          Create new Lesson
        </Button>
      )}

      {status === Status.Loading ? (
        <CircularProgress />
      ) : lessons.length > 0 ? (
        <div className="cards">
          {lessons.map((lesson) => (
            <CustomCard
              key={lesson._id}
              data={lesson}
              link="/lessons/"
              deleteAction={deleteLesson}
            />
          ))}
        </div>
      ) : (
        <Typography variant="h3">You haven't set any lesson</Typography>
      )}
    </>
  );
}

export default Lessons;
