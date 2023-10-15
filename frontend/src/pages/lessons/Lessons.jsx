import {Link} from "react-router-dom"
import {useSelector} from "react-redux"
import {deleteLesson, getLessons, reset as resetLessons} from "../../features/lessons/lessonSlice"
import CustomCard from "../../components/CustomCard"
import { Status } from "../../features/Status"
import useGetData from "../../hooks/useGetData"
import Typography from "@mui/material/Typography"
import CircularProgress from "@mui/material/CircularProgress"

function Lessons() {
  const { user } = useSelector((state) => state.auth)
  const { lessons, status } = useGetData("lessons", getLessons, resetLessons)

  return (
    <>
      <section className="heading">
        <Typography variant="h2">Lessons Dashboard</Typography>
      </section>

      <section className="content">
        {user.roles.includes("admin") || user.roles.includes("lector") ? <Link to={"/lessons/create"}>Create new Lesson</Link> : null}
        {status === Status.Loading ? <CircularProgress /> : lessons.length > 0 ? (
          <div className="cards">
            {lessons.map((lesson) => (
              <CustomCard key={lesson._id} data={lesson} link="/lessons/" deleteAction={deleteLesson} />
            ))}
          </div>
        ) : ( 
          <Typography variant="h3">You haven't set any lesson</Typography> 
        )}
      </section>
    </>
  )
}

export default Lessons