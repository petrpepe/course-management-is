import {useEffect} from "react"
import { useNavigate, useParams} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import Spinner from "../components/Spinner"
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { getAttendances, reset as attReset } from "../features/attendances/attendanceSlice"

function Timetable() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const id = useParams().id
  const { attendances, isLoading, isError, message } = useSelector((state) => state.attendances)
  const user = useSelector(state => state.auth.user)
  
  useEffect(() => {
    if(isError) {
      toast.error(message)
    }

    if (user) {
      dispatch(getAttendances({names: true, userId: user._id}))
    }

    return () => {
      dispatch(attReset())
    }
  }, [user, navigate, isError, message, dispatch])

  if (isLoading ) {
    return <Spinner />
  }

  const events = []
  if (attendances.length > 0) {
    attendances.map(att => {
      let end = new Date(att.datetime)
      end.setTime(end.getTime() + (att.lessonId && att.lessonId.duration ? att.lessonId.duration : 60) * 60000)
      events.push({title: att.classId + (att.lessonId && att.lessonId.title ? " lesson: " + att.lessonId.title : ""), 
      start: att.datetime, end: end.toISOString(), 
      lessonId: (att.lessonId && att.lessonId.id) ? [att.classId, att.lessonId.id] : [att.classId],
      attendees: att.attendees, attId: att._id})
      return att
    })
  }

  const eventClicked = (e) => {
    const extprops = e.event._def.extendedProps
    navigate("/lessons/call", {state: {lessonId: extprops.lessonId, roomName: extprops.lessonId, 
      attendees: extprops.attendees, attId: extprops.attId}})
  }

  return (
    <>
      <section className="heading">
        <h1>Rozvrh: {user.lastName + " " + user.firstName}</h1>
      </section>

      <section className="content">
        <FullCalendar
          plugins={[ timeGridPlugin ]}
          initialView="timeGridWeek"
          nowIndicator={true}
          locale={window.navigator.language}
          firstDay={1}
          events={events}
          eventClick={eventClicked}
        />
      </section>
    </>
  )
}

export default Timetable