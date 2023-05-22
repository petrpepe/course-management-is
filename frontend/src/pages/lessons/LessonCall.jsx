import {useEffect} from "react"
import {useLocation, useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import Spinner from "../../components/Spinner"
import AttendanceTable from "../../components/table/AttendanceTable"
import {getLessons, reset} from "../../features/lessons/lessonSlice"
import { JaaSMeeting } from "@jitsi/react-sdk"

function LessonCall() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { lessons, isLoading, isError, message } = useSelector((state) => state.lessons)
  const user = useSelector(state => state.auth.user)
  const location = useLocation()

  useEffect(() => {
    if(isError) {
      toast.error(message)
    }

    if (location.state.lessonId.length > 1) {
        dispatch(getLessons({ids: location.state.lessonId[1]}))
    }

    return () => {
      dispatch(reset())
    }
  }, [location.state.lessonId, navigate, isError, message, dispatch])

  if (isLoading) {
    return <Spinner />
  }

  const lesson = lessons.filter(les => les._id === location.state.lessonId[1])[0]

  return (
    <>
      <section className="lesson-content content">
        <div className="lesson-info">
          <div className="lesson-text">
            <h1>{location.state.lessonId[0] + " " + (lesson ? lesson.title : "" )}</h1>
            <p>{lesson ? "Odkaz: " + lesson.materials : ""}</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate enim quas ipsa, accusamus ratione similique tempore totam quibusdam eligendi molestiae perspiciatis illo quia optio facilis? Aut minima voluptatum maiores repellendus.</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate enim quas ipsa, accusamus ratione similique tempore totam quibusdam eligendi molestiae perspiciatis illo quia optio facilis? Aut minima voluptatum maiores repellendus.</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate enim quas ipsa, accusamus ratione similique tempore totam quibusdam eligendi molestiae perspiciatis illo quia optio facilis? Aut minima voluptatum maiores repellendus.</p>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cupiditate enim quas ipsa, accusamus ratione similique tempore totam quibusdam eligendi molestiae perspiciatis illo quia optio facilis? Aut minima voluptatum maiores repellendus.</p>
          </div>
          {location.state.attendees && (user.roles.includes("lector") || user.roles.includes("admin")) ? 
            <AttendanceTable data={location.state.attendees} user={user} attendeesOnly={true}/>
          : ""}
        </div> 
        <div className="videocall">
          <JaaSMeeting
            appId="criscoderebels"
            roomName = {location.state.attId}
            configOverwrite = {{
                startWithAudioMuted: true,
                disableModeratorIndicator: true,
                startScreenSharing: true,
                enableEmailInStats: false
            }}
            interfaceConfigOverwrite = {{
                DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
            }}
            userInfo = {{
                displayName: user.lastName + " " + user.firstName
            }}
            onApiReady = { (externalApi) => {
                // here you can attach custom event listeners to the Jitsi Meet External API
                // you can also store it locally to execute commands
            } }
            getIFrameRef = { (iframeRef) => { iframeRef.style.height = "100%"; } }
          />
        </div>
      </section>
    </>
  )
}

export default LessonCall