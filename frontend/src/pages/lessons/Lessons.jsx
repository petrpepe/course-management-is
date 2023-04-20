import {useEffect} from "react"
import {Link, useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import Spinner from "../../components/Spinner"
import {deleteLesson, getLessons, reset} from "../../features/lessons/lessonSlice"
import Card from "../../components/Card"

function Lessons() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { lessons, isLoading, isError, message } = useSelector((state) => state.lessons)

  useEffect(() => {
    if(isError) {
      toast.error(message)
    }
    
    if(!user) {
      navigate("/login")
      return
    }

    dispatch(getLessons())

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])

  return (
    <>
      <section className="heading">
        <h1>Lessons Dashboard</h1>
      </section>

      <section className="content">
        <Link to={"/lessons/create"}>Create new Lesson</Link>
        {isLoading ? <Spinner /> : lessons.length > 0 ? (
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