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
import CreateNewEntryLink from "../../components/form/CreateNewEntryLink";
import Grid from "@mui/material/Unstable_Grid2";

function Lessons() {
  const { lessons, status } = useGetData("lessons", getLessons, resetLessons);

  return (
    <>
      <Typography variant="h2">Lessons Dashboard</Typography>
      <Search getData={getLessons} resetData={resetLessons} />
      <CreateNewEntryLink
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
        <Typography variant="h3">You haven't set any lesson</Typography>
      )}
    </>
  );
}

export default Lessons;
