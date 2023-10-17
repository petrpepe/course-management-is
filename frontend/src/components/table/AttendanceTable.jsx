import CircularProgress from "@mui/material/CircularProgress"
import CheckBox from "../form/CheckBox"

function AttendanceTable({data = [], user = []}) {
  return (
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
          {data.map(attendance => (
            <tr key={attendance._id} >
              <td>{attendance.classId}</td>
              <td>{attendance.datetime}</td>
              <td>{attendance.lessonId ? attendance.lessonId.title : ""}</td>
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
  )
}

export default AttendanceTable