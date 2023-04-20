import {useEffect} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import Spinner from "../../components/Spinner"
import {getLessons, reset} from "../../features/lessons/lessonSlice"

function LessonDetail() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const id = useParams().id
  const { lessons, isLoading, isError, message } = useSelector((state) => state.lessons)

  useEffect(() => {
    if(isError) {
      toast.error(message)
    }

    dispatch(getLessons({ids: id}))

    return () => {
      dispatch(reset())
    }
  }, [id, navigate, isError, message, dispatch])

  if (isLoading || !lessons[0]) {
    return <Spinner />
  }

  const lesson = lessons.filter(les => les._id === id)[0]

  return (
    <>
      <section className="heading">
        <h1>Lesson: {lesson.title}</h1>
        <p>{lesson.description}</p>
      </section>

      <section className="content">
        <div>
          <p>{lesson.materials}</p>
        </div>
      </section>
    </>
  )
}

export default LessonDetail