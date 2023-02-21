import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import Spinner from "../components/Spinner"
import {getLessons, reset} from "../features/lessons/lessonSlice"

function Lessons() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { lessons, isLoading, isError, message } = useSelector((state) => state.lessons)

  useEffect(() => {
    if(isError) {
      console.log(message);
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

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.firstName + " " + user.lastName}</h1>
        <p>Lessons Dashboard</p>
      </section>

      <section className="content">
        {lessons.length > 0 ? (
          <div className="goals">
            {lessons.map((lesson) => (
                <div>
                    {JSON.stringify(lesson)}
                    <hr />
                </div>
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