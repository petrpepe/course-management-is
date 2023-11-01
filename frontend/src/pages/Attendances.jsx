import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AttendanceTable from "../components/table/AttendanceTable";
import {
  getAttendances,
  reset as resetAttendances,
} from "../features/attendances/attendanceSlice";
import useGetData from "../hooks/useGetData";
import { Typography } from "@mui/material";

function Attendances() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { attendances } = useGetData(
    "attendances",
    getAttendances,
    resetAttendances,
    { ids: id || user._id },
  );

  return (
    <>
      <Typography variant="h2">Attendances Dashboard</Typography>
      {attendances.length > 0 ? (
        <AttendanceTable user={user} isAdmin={id ? true : false} />
      ) : (
        <Typography variant="h3">You haven't set any attendance</Typography>
      )}
    </>
  );
}

export default Attendances;
