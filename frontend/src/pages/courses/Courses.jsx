import { Link as ReactLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  deleteCourse,
  getCourses,
  reset as resetCourses,
} from "../../features/courses/courseSlice";
import CustomCard from "../../components/CustomCard";
import Search from "../../components/Search";
import Typography from "@mui/material/Typography";
import useGetData from "../../hooks/useGetData";
import { Status } from "../../features/Status";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

function Courses() {
  const { user } = useSelector((state) => state.auth);
  const { courses, status } = useGetData("courses", getCourses, resetCourses);

  return (
    <>
      <Typography variant="h2">Courses Dashboard</Typography>
      <Search getData={getCourses} resetData={resetCourses} />
      {user.roles.includes("admin") && (
        <Button
          component={ReactLink}
          to="/courses/create"
          sx={{ color: "#fff" }}
        >
          Create new Course
        </Button>
      )}

      {status === Status.Loading ? (
        <CircularProgress />
      ) : courses.length > 0 ? (
        <div className="cards">
          {courses.map((classVar) => (
            <CustomCard
              key={classVar._id}
              data={classVar}
              link="/courses/"
              deleteAction={deleteCourse}
            />
          ))}
        </div>
      ) : (
        <Typography variant="h3">
          You are not enrolled in any courses
        </Typography>
      )}
    </>
  );
}

export default Courses;
