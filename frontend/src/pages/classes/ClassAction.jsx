import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import {
  createClass,
  getClasses,
  updateClass,
  reset as resetClasses,
} from "../../features/classes/classSlice";
import { getUsers, reset as resetUsers } from "../../features/users/userSlice";
import {
  getCourses,
  reset as resetCourses,
} from "../../features/courses/courseSlice";
import TextField from "@mui/material/TextField";
import CustomSelect from "../../components/form/CustomSelect";
import Button from "@mui/material/Button";
import { Status } from "../../features/Status";
import StudentModal from "../../components/form/StudentModal";
import Typography from "@mui/material/Typography";
import useGetData from "../../hooks/useGetData";
import { getRoles, reset as resetRoles } from "../../features/roles/roleSlice";
import Paper from "@mui/material/Paper";
import LoadingOrError from "../../components/LoadingOrError";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { parseISO } from "date-fns/esm";

function ClassAction() {
  const [isCreated, setIsCreated] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [changed, setChanged] = useState(false);

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
    title: "",
    description: "",
    place: "",
    startDateTime: today,
    course: "",
    lectors: [],
  });

  const dispatch = useDispatch();

  const { id } = useParams();
  const { users, status: userStatus } = useGetData(
    "users",
    getUsers,
    resetUsers
  );
  const { courses, status: courseStatus } = useGetData(
    "courses",
    getCourses,
    resetCourses
  );
  const { classes, status: classStatus } = useGetData(
    "classes",
    getClasses,
    resetClasses,
    { ids: id }
  );
  const { roles, status: roleStatus } = useGetData(
    "roles",
    getRoles,
    resetRoles
  );

  let currentClassId = null;

  useEffect(() => {
    if (id && classStatus === Status.Success) {
      setFormData(classes.filter((c) => c._id === id)[0]);
    }
  }, [id, classStatus, classes]);

  const onChange = (e) => {
    setChanged(true);
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onPickerChange = (e, id) => {
    setFormData((prevState) => ({
      ...prevState,
      [id]: e,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (changed) {
      formData.startDateTime = formData.startDateTime.toLocaleString();
    }

    if (id) {
      dispatch(updateClass(formData));
      currentClassId = id;
    } else {
      dispatch(createClass(formData));
      setIsCreated(true);
    }
    setOpenModal(true);
  };

  if (isCreated && classStatus === Status.Success) {
    currentClassId = classes[classes.length - 1]._id;
  }

  if (
    classStatus === Status.Loading ||
    roleStatus === Status.Loading ||
    courseStatus === Status.Loading ||
    userStatus === Status.Loading ||
    userStatus === Status.Idle
  ) {
    return <LoadingOrError status={Status.Loading} />;
  }

  let lectorsOptions = [];
  if (userStatus === Status.Success && roleStatus === Status.Success) {
    lectorsOptions = users.filter((u) =>
      u.roles.includes(roles.filter((r) => r.name === "lector")[0]._id)
    );
  }

  return (
    <Paper elevation={0} sx={{ my: 5, mx: "auto", maxWidth: "1000px" }}>
      <Typography variant="h3" component="h1">
        <CoPresentIcon fontSize="large" />{" "}
        {id ? "Editing class: " + formData.title : "Create class"}
      </Typography>
      <form onSubmit={onSubmit}>
        <TextField
          id="title"
          name="title"
          label="Title:"
          value={formData.title}
          onChange={(e) => onChange(e)}
          required={true}
          size="medium"
          fullWidth
          sx={{ my: 1 }}
        />
        <TextField
          id="description"
          name="description"
          label="Description"
          value={formData.description}
          onChange={(e) => onChange(e)}
          size="medium"
          fullWidth
          sx={{ my: 1 }}
        />
        <DateTimePicker
          id="startDateTime"
          name="startDateTime"
          label="First lesson:"
          value={parseISO(formData.startDateTime)}
          onChange={(e) => onPickerChange(e, "startDateTime")}
          size="medium"
          sx={{ my: 1, width: "100%" }}
        />
        <TextField
          id="place"
          name="place"
          label="Place (address or online url)"
          value={formData.place}
          onChange={(e) => onChange(e)}
          size="medium"
          fullWidth
          sx={{ my: 1 }}
        />
        <CustomSelect
          id="course"
          label="Select course"
          selectedItems={
            courses.filter((c) => c._id === formData.course).length > 0
              ? courses
                  .filter((c) => c._id === formData.course)
                  .map((c) => {
                    return { _id: c._id, title: c.title };
                  })[0]
              : null
          }
          items={courses.map((c) => {
            return { _id: c._id, title: c.title };
          })}
          formData={formData}
          setFormData={setFormData}
          multiple={false}
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
        <Button
          type="submit"
          size="large"
          variant="outlined"
          fullWidth
          sx={{ my: 1 }}>
          Submit
        </Button>
      </form>
      <StudentModal
        users={users}
        roles={roles}
        defaultOpened={openModal}
        setOpenModal={setOpenModal}
        classId={currentClassId || id}
        isCreated={isCreated}
      />
    </Paper>
  );
}

export default ClassAction;
