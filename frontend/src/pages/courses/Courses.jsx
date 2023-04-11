import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import {getCourses, reset} from "../../features/courses/courseSlice"
import Card from "../../components/Card"
import Spinner from "../../components/Spinner"
import CourseForm from "../../components/form/CourseForm"

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
        <h1>Welcome {user && user.firstName + " " + user.lastName}</h1>
        <p>Courses dashboard</p>
      </section>

      <CourseForm />

      {isLoading ? <Spinner /> :
        <section className="content">
          {courses.length > 0 ? (
            <div className="cards">
              {courses.map((course) => (
                <Card key={course._id} data={course} />
              ))}
            </div>
          ) : ( 
            <h3>You haven't set any course</h3> 
            )}
        </section>
      }
    </>
  )
}

export default Courses