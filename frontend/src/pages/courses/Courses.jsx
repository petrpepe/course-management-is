import {Link} from "react-router-dom"
import {useSelector} from "react-redux"
import {deleteCourse, getCourses, reset as resetCourses} from "../../features/courses/courseSlice"
import CustomCard from "../../components/CustomCard"
import Spinner from "../../components/Spinner"
import Search from "../../components/Search"
import Typography from "@mui/material/Typography"
import useGetData from "../../hooks/useGetData"
import { Status } from "../../features/Status"

function Courses() {
  const { user } = useSelector((state) => state.auth)
  const { courses, status } = useGetData("courses", getCourses, resetCourses)

  return (
    <>
      <section className="heading">
        <Typography variant="h2">Courses dashboard</Typography>
      </section>

      <section className="content">
        <Search getData={getCourses} />
        {user.roles.includes("admin") && <Link to={"/courses/create"}>Create new Course</Link>}
        {status === Status.Loading ? <Spinner /> : courses.length > 0 ? (
          <div className="cards">
            {courses.map((course) => (
              <CustomCard key={course._id} data={course} link="/courses/" deleteAction={deleteCourse} imgSrc="https://a6ad4808de.clvaw-cdnwnd.com/3fcec247b0b3f551f164ba2370f83229/200000532-3961c3961d/3D%20modelovani%202-58.jpg?ph=a6ad4808de" />
            ))}
          </div>
        ) : (
          <Typography variant="h3">You haven't set any course</Typography> 
        )}
      </section>
    </>
  )
}

export default Courses