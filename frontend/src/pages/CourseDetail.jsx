import {useEffect} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import Spinner from "../components/Spinner"
import {getCourseById, reset} from "../features/courses/courseSlice"

function CourseDetail() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const id = useParams().id
  const { courses, isLoading, isError, message } = useSelector((state) => state.courses)

  useEffect(() => {
    if(isError) {
      console.log(message);
    }

    dispatch(getCourseById(id))

    return () => {
      dispatch(reset())
    }
  }, [id, navigate, isError, message, dispatch])

  if (isLoading || courses.length === 0) {
    return <Spinner />
  }

  const course = courses[0]

  return (
    <>
      <section className="heading">
        <h1>Course: {course.title}</h1>
        <p>{course.desctiption}</p>
      </section>

      <section className="content">
        <p>{Object.values(course)}</p>
      </section>
    </>
  )
}

export default CourseDetail