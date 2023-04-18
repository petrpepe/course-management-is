import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import Spinner from "../components/Spinner"
import {getAttendances, reset, updateAttendance} from "../features/attendances/attendanceSlice"

function Attendances() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { attendances, isLoading, isError, message } = useSelector((state) => state.attendances)

  useEffect(() => {
    if(isError) {
      toast.error(message)
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

  const onAttTypeChange = (attId, userId, e) => {
    dispatch(updateAttendance({_id: attId, userId: userId, attType: e.target.checked}))
  }

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
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Date and time</th>
                <th>Lesson</th>
                <th>Attendees</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((attendance) => (
                <tr key={attendance._id} >
                  <td>{attendance.classId}</td>
                  <td>{attendance.datetime}</td>
                  <td>{attendance.lessonId}</td>
                  <td>{attendance.attendees.map(att => {
                    return <p key={att.user}>{att.user} : <input name="attType" id="attType" type="checkbox" onChange={(e) => onAttTypeChange(attendance._id, att.user, e)} /></p>
                  })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : ( 
          <h3>You haven't set any attendance</h3> 
          )}
      </section>
    </>
  )
}

export default Attendances