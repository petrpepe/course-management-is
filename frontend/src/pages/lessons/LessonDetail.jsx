import {useEffect} from "react"
import {useParams} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import Spinner from "../../components/Spinner"
import {getLessons} from "../../features/lessons/lessonSlice"
import { Status } from "../../features/Status"

function LessonDetail() {
  const dispatch = useDispatch()

  const id = useParams().id
  const { lessons, status } = useSelector((state) => state.lessons)

  useEffect(() => {
    if (status === Status.Idle) {
      dispatch(getLessons({ids: id, detail: true}))
    }
  }, [id, status, dispatch])

  if (status === Status.Loading || !lessons[0]) {
    return <Spinner />
  }

  const lesson = lessons.filter(les => les._id === id)[0]

  return (
    <>
      <section className="heading">
        <h1>Lesson: {lesson.title}</h1>
        <p>{lesson.materials}</p>
        <p>{lesson.description}</p>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veniam delectus rem quae deserunt consequuntur officia atque qui in cumque eius reprehenderit, quas id iste minima accusamus aspernatur. Pariatur, unde animi!</p>
      </section>
    </>
  )
}

export default LessonDetail