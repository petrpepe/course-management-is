import {useEffect} from "react"
import {Link} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import Spinner from "../../components/Spinner"
import {deleteLesson, getLessons} from "../../features/lessons/lessonSlice"
import Card from "../../components/Card"
import { Status } from "../../features/Status"

function Lessons() {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { lessons, status } = useSelector((state) => state.lessons)

  useEffect(() => {
    if (status === Status.Idle) {
      dispatch(getLessons())
    }
  }, [user, status, dispatch])

  return (
    <>
      <section className="heading">
        <h1>Lessons Dashboard</h1>
      </section>

      <section className="content">
        {user.roles.includes("admin") || user.roles.includes("lector") ? <Link to={"/lessons/create"}>Create new Lesson</Link> : null}
        {status === Status.Loading ? <Spinner /> : lessons.length > 0 ? (
          <div className="cards">
            {lessons.map((lesson) => (
              <Card key={lesson._id} data={lesson} link="/lessons/" currentData={{currentLesson: lesson}} deleteAction={deleteLesson} />
            ))}
          </div>
        ) : ( 
          <h3>You haven't set any lesson</h3> 
        )}
      </section>
    </>
  )
}

export default Lessons