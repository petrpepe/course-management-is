import CheckBox from "../form/CheckBox"
import Spinner from "../Spinner"

function AttendanceTable({data = [], user = [], attendeesOnly = false, isLoading = false}) {
  return (
    <>
      {data.length > 0 && attendeesOnly && (
      <div className="table-wrapper">
      <table className="res-table">
      <thead>
          <tr>
              <th>Attendee</th>
              <th>#</th>
          </tr>
      </thead>
      <tbody>
        {isLoading ? <Spinner /> : data.map(attendance => {
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
      </div>
      )}
      {data.length > 0 && !attendeesOnly && (
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
          {isLoading ? <Spinner /> : data.map(attendance => (
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
      </div>
      )}
    </>
  )
}

export default AttendanceTable