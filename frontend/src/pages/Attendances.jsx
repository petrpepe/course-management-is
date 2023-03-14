import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import Spinner from "../components/Spinner"
import {getAttendances, reset} from "../features/attendances/attendanceSlice"

function Attendances() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { attendances, isLoading, isError, message } = useSelector((state) => state.attendances)

  useEffect(() => {
    if(isError) {
      console.log(message);
    }
    
    if(!user) {
      navigate("/login")
      return
    }

    dispatch(getAttendances())

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
        <p>Attendances Dashboard</p>
      </section>

      <section className="content">
        {attendances.length > 0 ? (
          <div className="cards">
            {attendances.map((attendance) => (
                <div>
                    {JSON.stringify(attendance)}
                    <hr />
                </div>
            ))}
          </div>
        ) : ( 
          <h3>You haven't set any attendance</h3> 
          )}
      </section>
    </>
  )
}

export default Attendances