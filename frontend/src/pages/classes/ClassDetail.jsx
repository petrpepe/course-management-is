import {useEffect} from "react"
import {Link, useNavigate, useParams} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import Spinner from "../../components/Spinner"
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import {getClasses, reset as classReset} from "../../features/classes/classSlice"
import { getAttendances, reset as attReset } from "../../features/attendances/attendanceSlice"

function ClassDetail() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const id = useParams().id
  const { classes, isLoading, isError, message } = useSelector((state) => state.classes)
  const attendances = useSelector((state) => state.attendances)
  //const user = useSelector(state => state.auth.user)
  
  useEffect(() => {
    if(isError || attendances.isError) {
      toast.error(message + attendances.message)
    }

    dispatch(getClasses({ids: id}))

    if (id) {
      dispatch(getAttendances({names: true, classId: id}))
    }

    return () => {
      dispatch(classReset())
      dispatch(attReset())
    }
  }, [id, navigate, isError, attendances.isError, message, attendances.message, dispatch])

  if (isLoading || !classes[0]) {
    return <Spinner />
  }

  const classVar = classes[0]
  const events = []
  if (attendances.attendances.length > 0) {
    attendances.attendances.map(att => {
      let end = new Date(att.datetime)
      end.setTime(end.getTime() + (att.lessonId && att.lessonId.duration ? att.lessonId.duration : 60) * 60000)
      events.push({title: classVar.title + (att.lessonId && att.lessonId.title ? " lesson: " + att.lessonId.title : ""), 
      start: att.datetime, end: end.toISOString(), 
      lessonId: (att.lessonId && att.lessonId.id) ? [classVar.title, att.lessonId.id] : [classVar.title],
      attendees: att.attendees, attId: att._id})
      return att
    })
  }

  const eventClicked = (e) => {
    const extprops = e.event._def.extendedProps
    navigate("/lessons/call", {state: {lessonId: extprops.lessonId, roomName: classVar.title, 
      attendees: extprops.attendees, attId: extprops.attId}})
  }

  return (
    <>
      <section className="heading">
        <h1>Class: {classVar.title}</h1>
        <p>{classVar.desctiption}</p>
      </section>

      <section className="content calendar-wrapper">
        <FullCalendar
          plugins={[ timeGridPlugin ]}
          initialView="timeGridWeek"
          nowIndicator={true}
          locale={window.navigator.language}
          firstDay={1}
          events={events}
          eventClick={eventClicked}
          height={"75vh"}
        />
        <Link to={"/classes/" + classVar._id + "/edit"} state={{currentClass: classVar}}>Edit</Link>
      </section>
    </>
  )
}

export default ClassDetail