import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import {
  createCourse,
  getCourses,
  updateCourse,
  reset as resetCourses,
} from "../../features/courses/courseSlice";
import {
  getProviders,
  reset as resetProviders,
} from "../../features/providers/providerSlice";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CustomSelect from "../../components/form/CustomSelect";
import useGetData from "../../hooks/useGetData";
import Typography from "@mui/material/Typography";
import { Status } from "../../features/Status";
import Paper from "@mui/material/Paper";
import LoadingOrError from "../../components/LoadingOrError";

function CourseAction() {
  const [isCreated, setIsCreated] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    academicTerm: "",
    owner: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();
  const { courses, status: courseStatus } = useGetData(
    "courses",
    getCourses,
    resetCourses
  );
  const { providers, status: providerStatus } = useGetData(
    "providers",
    getProviders,
    resetProviders
  );

  useEffect(() => {
    if (id && courseStatus === Status.Success)
      setFormData(courses.filter((l) => l._id === id)[0]);
  }, [id, courseStatus, courses]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (id) {
      dispatch(updateCourse(formData));
      navigate("/courses/" + id);
    } else {
      dispatch(createCourse(formData));
      setIsCreated(true);
    }
  };

  if (isCreated && courseStatus === Status.Success) {
    return navigate("/courses/" + courses[courses.length - 1]._id);
  }

  if (courseStatus === Status.Loading || providerStatus === Status.Loading) {
    return <LoadingOrError status={Status.Loading} />;
  }

  return (
    <Paper elevation={0} sx={{ my: 5, mx: "auto", maxWidth: "1000px" }}>
      <Typography variant="h2">
        <SchoolIcon fontSize="large" />{" "}
        {id ? "Editing course: " + formData.title : "Create course"}
      </Typography>
      <form onSubmit={onSubmit}>
        <TextField
          id="title"
          name="title"
          label="Title"
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
        <TextField
          id="academicTerm"
          name="academicTerm"
          label="Academic Term"
          value={formData.academicTerm}
          onChange={(e) => onChange(e)}
          size="medium"
          fullWidth
          sx={{ my: 1 }}
        />
        <CustomSelect
          id="owner"
          label="Select owner"
          items={providers.map((p) => {
            return { _id: p._id, title: p.name };
          })}
          formData={formData}
          setFormData={setFormData}
          multiple={false}
          selectedItems={
            formData.owner &&
            providers
              .filter((p) => p._id === formData.owner)
              .map((p) => {
                return { _id: p._id, title: p.name };
              })[0]
          }
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

export default CourseAction;
