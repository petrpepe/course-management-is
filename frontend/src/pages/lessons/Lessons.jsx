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
import Search from "../../components/Search";
import ActionPermLink from "../../components/form/ActionPermLink";
import Grid from "@mui/material/Unstable_Grid2";

function Lessons() {
  const { lessons, status } = useGetData("lessons", getLessons, resetLessons);

  return (
    <>
      <Typography variant="h3" component="h1">
        Lessons Dashboard
      </Typography>
      <Search getData={getLessons} resetData={resetLessons} />
      <ActionPermLink
        linkText="Create new Lesson"
        linkTo="/lessons/create"
        perm="lessonCreate"
      />

      {status === Status.Loading ? (
        <CircularProgress />
      ) : lessons.length > 0 ? (
        <Grid container spacing={3} justifyContent="space-evenly">
          {lessons.map((lesson) => (
            <Grid key={lesson._id}>
              <CustomCard
                data={lesson}
                link="/lessons/"
                deleteAction={deleteLesson}
                deletePerm="lessonDelete"
                editPerm="lessonUpdate"
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h4" component="h2">
          You haven't set any lesson
        </Typography>
      )}
    </>
  );
}

export default Lessons;
