import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import {
  getClasses,
  reset as resetClasses,
} from "../../features/classes/classSlice";
import { getUsers, reset as resetUsers } from "../../features/users/userSlice";
import {
  createTimetable,
  getTimetables,
  reset as resetTimetables,
  updateTimetable,
} from "../../features/timetables/timetableSlice";
import {
  getLessons,
  reset as resetLessons,
} from "../../features/lessons/lessonSlice";
import {
  getEnrollments,
  reset as resetEnrollments,
} from "../../features/enrollments/enrollmentSlice";
import CustomSelect from "../../components/form/CustomSelect";
import Button from "@mui/material/Button";
import { Status } from "../../features/Status";
import Typography from "@mui/material/Typography";
import useGetData from "../../hooks/useGetData";
import { getRoles, reset as resetRoles } from "../../features/roles/roleSlice";
import Paper from "@mui/material/Paper";
import LoadingOrError from "../../components/LoadingOrError";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { parseISO } from "date-fns/esm";

function TimetableEventAction() {
  const [isCreated, setIsCreated] = useState(false);
  const { id, classId } = useParams();

  let today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  today =
    year +
    "-" +
    (month < 10 ? "0" + month : month) +
    "-" +
    (day < 10 ? "0" + day : day) +
    "T12:00";

  const [formData, setFormData] = useState({
    classId: classId,
    datetime: "",
    lectors: [],
    extraUser: [],
    lesson: "",
  });

  const dispatch = useDispatch();

  const { users, status: userStatus } = useGetData(
    "users",
    getUsers,
    resetUsers
  );
  const { timetables, status: timetableStatus } = useGetData(
    "timetables",
    getTimetables,
    resetTimetables,
    { ids: id }
  );
  const { classes, status: classStatus } = useGetData(
    "classes",
    getClasses,
    resetClasses,
    { ids: classId }
  );
  const { lessons, status: lessonStatus } = useGetData(
    "lessons",
    getLessons,
    resetLessons,
    classes.length > 0 && { ids: classes[0].course }
  );
  const { enrollments, status: enrollmentStatus } = useGetData(
    "enrollments",
    getEnrollments,
    resetEnrollments,
    { ids: classId }
  );
  const { roles, status: roleStatus } = useGetData(
    "roles",
    getRoles,
    resetRoles
  );

  let currentTEId = null;

  useEffect(() => {
    if (id && timetableStatus === Status.Success) {
      setFormData(timetables.filter((c) => c._id === id)[0]);
    }
  }, [id, timetableStatus, timetables]);

  const onPickerChange = (e, id) => {
    setFormData((prevState) => ({
      ...prevState,
      [id]: e,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (id) {
      dispatch(updateTimetable(formData));
      currentTEId = id;
    } else {
      dispatch(createTimetable(formData));
      setIsCreated(true);
    }
  };

  if (isCreated && timetableStatus === Status.Success) {
    currentTEId = timetables[timetables.length - 1]._id;
  }

  if (
    classStatus === Status.Loading ||
    roleStatus === Status.Loading ||
    userStatus === Status.Loading ||
    lessonStatus === Status.Loading ||
    timetableStatus === Status.Loading
  ) {
    return <LoadingOrError status={Status.Loading} />;
  }

  let lectorsOptions = [];
  let studentsOptions = [];
  if (userStatus === Status.Success && roleStatus === Status.Success) {
    lectorsOptions = users.filter((u) =>
      u.roles.includes(roles.filter((r) => r.name === "lector")[0]._id)
    );
  }

  if (userStatus === Status.Success && enrollmentStatus === Status.Success) {
    studentsOptions =
      enrollments.length > 0
        ? users.filter((u) =>
            enrollments
              .filter((e) => e.classId === classId)[0]
              .students.includes(u._id)
          )
        : [];
  }

  return (
    <Paper elevation={0} sx={{ my: 5, mx: "auto", maxWidth: "1000px" }}>
      <Typography variant="h3" component="h1">
        <CoPresentIcon fontSize="large" /> {id ? "Editing" : "Cover lesson"}
      </Typography>
      <form onSubmit={onSubmit}>
        <DateTimePicker
          id="datetime"
          name="datetime"
          label="First lesson:"
          value={parseISO(formData.datetime)}
          onChange={(e) => onPickerChange(e, "datetime")}
          size="medium"
          sx={{ my: 1, width: "100%" }}
        />
        <CustomSelect
          id="lesson"
          label="Select lesson"
          selectedItems={
            lessons
              .filter((l) => formData.lesson === l._id)
              .map((l) => {
                return {
                  _id: l._id,
                  title: l.title,
                };
              })[0]
          }
          items={lessons.map((l) => {
            return { _id: l._id, title: l.title };
          })}
          formData={formData}
          setFormData={setFormData}
        />
        <CustomSelect
          id="lectors"
          label="Select lectors"
          selectedItems={lectorsOptions
            .filter((u) => formData.lectors.includes(u._id))
            .map((u) => {
              return {
                _id: u._id,
                title: u.lastName + " " + u.firstName,
              };
            })}
          items={lectorsOptions.map((u) => {
            return { _id: u._id, title: u.lastName + " " + u.firstName };
          })}
          formData={formData}
          setFormData={setFormData}
          multiple={true}
        />
        <CustomSelect
          id="extraUser"
          label="Select extra students"
          selectedItems={studentsOptions
            .filter((u) => formData.extraUser.includes(u._id))
            .map((u) => {
              return {
                _id: u._id,
                title: u.lastName + " " + u.firstName,
              };
            })}
          items={studentsOptions.map((u) => {
            return { _id: u._id, title: u.lastName + " " + u.firstName };
          })}
          formData={formData}
          setFormData={setFormData}
          multiple={true}
        />
        <Button
          type="submit"
          size="large"
          variant="outlined"
          fullWidth
          sx={{ my: 1 }}>
          Submit
        </Button>
      </form>
    </Paper>
  );
}

export default TimetableEventAction;
