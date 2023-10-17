import CircularProgress from "@mui/material/CircularProgress"
import CheckBox from "../form/CheckBox"

function LessonAttendanceTable({user = [], isAdmin = []}) {
  return (
      <table className="res-table">
      <thead>
          <tr>
              <th>Attendee</th>
              <th>#</th>
          </tr>
      </thead>
      <tbody>
        {data.map(attendance => {
          return (
            <tr key={attendance.user}>
              <td>{attendance.name}</td>
              <td><CheckBox id="attType" defaultValue={attendance.attType === "true" ? true : false} 
              attId={attendance._id} userId={attendance.user} /></td>
            </tr>
          )
          })}
      </tbody>
      </table>
  )
}

export default LessonAttendanceTable