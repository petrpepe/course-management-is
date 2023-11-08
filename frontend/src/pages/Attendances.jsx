import { useSelector } from "react-redux";
import AttendanceTable from "../components/table/AttendanceTable";
import {
  getAttendances,
  reset as resetAttendances,
} from "../features/attendances/attendanceSlice";
import useGetData from "../hooks/useGetData";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CustomSelect from "../components/form/CustomSelect";
import { getUsers, reset as resetUsers } from "../features/users/userSlice";
import {
  getClasses,
  reset as resetClasses,
} from "../features/classes/classSlice";
import { useState } from "react";
import { Status } from "../features/Status";
import LoadingOrError from "../components/LoadingOrError";

function Attendances() {
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    userId: user.roles.includes("student") ? user._id : "",
    classId: "",
  });
  const { users, status: userStatus } = useGetData(
    "users",
    getUsers,
    resetUsers,
    { ids: formData.userId || "null" }
  );
  const { classes, status: classStatus } = useGetData(
    "classes",
    getClasses,
    resetClasses,
    { ids: formData.classId || "null" }
  );
  const { attendances, status: attendanceStatus } = useGetData(
    "attendances",
    getAttendances,
    resetAttendances,
    { ids: [formData.userId, formData.classId] }
  );

  const userItem = users.filter((u) => u._id === formData.userId)[0];
  const classItem = classes.filter((c) => c._id === formData.classId)[0];

  return (
    <>
      <Typography variant="h2">Attendances Dashboard</Typography>
      <Box>
        {userStatus === Status.Success ? (
          <CustomSelect
            id="user"
            label="Select user"
            items={{
              _id: userItem._id,
              title: userItem.lastName + " " + userItem.firstName,
            }}
            formData={formData}
            selectedItems={formData}
            setFormData={setFormData}
          />
        ) : (
          <LoadingOrError status={userStatus} />
        )}
        {classStatus === Status.Success ? (
          <CustomSelect
            id="class"
            label="Select class"
            items={{
              _id: classItem._id,
              title: classItem.name,
            }}
            formData={formData}
            selectedItems={formData}
            setFormData={setFormData}
          />
        ) : (
          <LoadingOrError status={classStatus} />
        )}
      </Box>
      {attendances.length > 0 ? (
        <AttendanceTable
          attendances={attendances}
          title={users.length > 0 ? users[0] : classes[0]}
        />
      ) : (
        <Typography variant="h3">You haven't set any attendance</Typography>
      )}
    </>
  );
}

export default Attendances;
