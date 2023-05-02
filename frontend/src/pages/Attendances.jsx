import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import AttendanceTable from "../components/table/AttendanceTable"
import {getAttendances, reset} from "../features/attendances/attendanceSlice"

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
          <AttendanceTable data={attendances} user={user} attendeesOnly={false} isLoading={isLoading} />
        ) : ( 
          <h3>You haven't set any attendance</h3> 
          )}
      </section>
    </>
  )
}

export default Attendances