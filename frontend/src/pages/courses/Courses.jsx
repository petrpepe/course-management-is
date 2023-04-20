import {useEffect} from "react"
import {Link, useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import {deleteCourse, getCourses, reset} from "../../features/courses/courseSlice"
import Card from "../../components/Card"
import Spinner from "../../components/Spinner"

function Courses() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { courses, isLoading, isError, message } = useSelector((state) => state.courses)

  useEffect(() => {
    if(isError) {
      toast.error(message);
    }

    if(!user) {
      navigate("/login")
      return
    }

    dispatch(getCourses())

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])


  return (
    <>
      <section className="heading">
        <h1>Courses dashboard</h1>
      </section>

      <section className="content">
        <Link to={"/courses/create"}>Create new Course</Link>
          {isLoading ? <Spinner /> : courses.length > 0 ? (
            <div className="cards">
              {courses.map((course) => (
                <Card key={course._id} data={course} link="/courses/" deleteAction={deleteCourse} currentData={{currentCourse: course}} imgSrc="https://a6ad4808de.clvaw-cdnwnd.com/3fcec247b0b3f551f164ba2370f83229/200000532-3961c3961d/3D%20modelovani%202-58.jpg?ph=a6ad4808de" />
              ))}
            </div>
          ) : (
            <h3>You haven't set any course</h3> 
          )}
      </section>
    </>
  )
}

export default Courses