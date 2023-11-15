import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CustomSelect from "./CustomSelect";
import Button from "@mui/material/Button";
import {
  createEnrollment,
  getEnrollments,
  reset as resetEnrollments,
  updateEnrollment,
} from "../../features/enrollments/enrollmentSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetData from "../../hooks/useGetData";
import { Status } from "../../features/Status";

const StudentModal = ({
  users,
  roles,
  defaultOpened,
  setOpenModal,
  classId,
  isCreated,
}) => {
  const { enrollments, status: enrollmentStatus } = useGetData(
    "enrollments",
    getEnrollments,
    resetEnrollments,
    { ids: classId }
  );

  const [formData, setFormData] = React.useState({ classId: "", students: [] });
  const [anyChange, setAnyChange] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (enrollmentStatus === Status.Success && !isCreated) {
      setFormData(enrollments[0]);
    }
  }, [enrollments, enrollmentStatus, isCreated]);

  const handleClose = (e, reason) => {
    if (reason !== "backdropClick") {
      setOpenModal(false);
    }
  };

  const onAdd = () => {
    if (enrollments.length === 0) {
      formData.classId = classId;
      dispatch(createEnrollment(formData));
    } else if (anyChange) {
      formData._id = enrollments[0]._id;
      dispatch(updateEnrollment(formData));
    }
    setOpenModal(false);
    navigate("/classes/" + classId);
  };

  const studentsOptions =
    roles.length > 0
      ? users.filter((u) =>
          u.roles.includes(roles.filter((r) => r.name === "student")[0]._id)
        )
      : [];

  return (
    <Dialog open={defaultOpened} onClose={handleClose}>
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>Enroll student to class</DialogContentText>
        <CustomSelect
          id="students"
          label="Select students"
          items={studentsOptions.map((u) => {
            return { _id: u._id, title: u.lastName + " " + u.firstName };
          })}
          formData={formData.students}
          setFormData={setFormData}
          multiple={true}
          selectedItems={studentsOptions
            .filter((u) => formData.students.includes(u._id))
            .map((u) => {
              return {
                _id: u._id,
                title: u.lastName + " " + u.firstName,
              };
            })}
          changed={setAnyChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onAdd}>{isCreated ? "Add" : "Update"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentModal;
