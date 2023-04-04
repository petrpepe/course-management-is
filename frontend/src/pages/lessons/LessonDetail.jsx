import {useEffect} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import Spinner from "../../components/Spinner"
import {getLessonById, reset} from "../../features/lessons/lessonSlice"

function LessonDetail() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const id = useParams().id
  const { lessons, isLoading, isError, message } = useSelector((state) => state.lessons)

  useEffect(() => {
    if(isError) {
      toast.error(message)
    }

    dispatch(getLessonById(id))

    return () => {
      dispatch(reset())
    }
  }, [id, navigate, isError, message, dispatch])

  if (isLoading || lessons.length === 0) {
    return <Spinner />
  }

  const lesson = lessons[0]

  return (
    <>
      <section className="heading">
        <h1>Lesson: {lesson.title}</h1>
        <p>{lesson.desctiption}</p>
      </section>

      <section className="content">
        <p>{Object.values(lesson)}</p>
      </section>
    </>
  )
}

export default LessonDetail