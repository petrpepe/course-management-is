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
import { useNavigate, useParams } from "react-router-dom";

function Attendances() {
  const { id, specId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const idArray = [id, specId].filter((i) => i !== undefined);
  console.log(idArray);
  const { users, status: userStatus } = useGetData(
    "users",
    getUsers,
    resetUsers,
    { ids: idArray }
  );
  const { classes, status: classStatus } = useGetData(
    "classes",
    getClasses,
    resetClasses,
    { ids: idArray }
  );
  const { attendances, status: attendanceStatus } = useGetData(
    "attendances",
    getAttendances,
    resetAttendances,
    { ids: idArray }
  );

  const userItem = users.filter((u) => u._id === id || u._id === specId)[0];
  const classItem = classes.filter((c) => c._id === id || c._id === specId)[0];

  const selectChange = (type, e, value) => {
    if (type === "user") {
      setSelectedUser(value);
      navigate(
        "/attendances/" +
          (value ? value._id + "/" : "") +
          (classItem ? classItem._id : "")
      );
    }
    if (type === "class") {
      setSelectedClass(value);
      navigate(
        "/attendances/" +
          (userItem ? userItem._id + "/" : "") +
          (value ? value._id : "")
      );
    }
  };

  return (
    <>
      <Typography variant="h2">Attendances Dashboard</Typography>
      <Box>
        {userStatus === Status.Success ? (
          <CustomSelect
            id="user"
            label="Select user"
            items={users.map((u) => {
              return { _id: u._id, title: u.lastName + " " + u.firstName };
            })}
            selectedItems={selectedUser}
            selectChange={(e, value) => selectChange("user", e, value)}
          />
        ) : (
          <LoadingOrError status={userStatus} />
        )}
        {classStatus === Status.Success ? (
          <CustomSelect
            id="class"
            label="Select class"
            items={classes.map((c) => {
              return { _id: c._id, title: c.title };
            })}
            selectedItems={selectedClass}
            selectChange={(e, value) => selectChange("class", e, value)}
          />
        ) : (
          <LoadingOrError status={classStatus} />
        )}
      </Box>
      {attendances.length > 0 ? (
        <AttendanceTable
          attendances={attendances}
          userItem={userItem}
          classItem={classItem}
        />
      ) : (
        <Typography variant="h3">You haven't set any attendance</Typography>
      )}
    </>
  );
}

export default Attendances;
