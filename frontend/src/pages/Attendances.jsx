import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import Spinner from "../components/Spinner"
import {getAttendances, reset} from "../features/attendances/attendanceSlice"
import CheckBox from "../components/form/CheckBox"

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

    dispatch(getAttendances({names: true}))

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])

  return (
    <>
      <section className="heading">
        <h1>Attendances Dashboard</h1>
      </section>

      <section className="content">
        {attendances.length > 0 ? (
          <div className="table-wrapper">
          <table className="res-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Date and time</th>
                <th>Lesson</th>
                <th>Attendees</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <Spinner /> : attendances.map(attendance => (
                <tr key={attendance._id} >
                  <td>{attendance.classId}</td>
                  <td>{attendance.datetime}</td>
                  <td>{attendance.lessonId}</td>
                  <td>{attendance.attendees.map(att =>{
                    if(user.roles.includes("student") && att.user === user._id) 
                    {
                      return <p key={att.user}>{att.name} {att.attType === "true" ? <span> attended</span> : <span> missed</span>}</p>
                    }
                    if(user.roles.includes("admin") || user.roles.includes("lector")) {
                      return (
                      <p key={att.user}>{att.name}
                        <> : <CheckBox id="attType" defaultValue={att.attType === "true" ? true : false} 
                        attId={attendance._id} userId={att.user} /> </> 
                      </p>)
                    }
                    return null
                  })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : ( 
          <h3>You haven't set any attendance</h3> 
          )}
      </section>
    </>
  )
}

export default Attendances