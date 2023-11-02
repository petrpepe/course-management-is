import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import KeyIcon from "@mui/icons-material/Key";
import { setNewPassword, reset } from "../../features/auth/authSlice";
import { Status } from "../../features/Status";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";

function ForgottenPassword() {
  const [formData, setFormData] = useState({
    password: "",
    password1: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userId } = useParams();

  const { user, status, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (status === Status.Success || user) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, status, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      ...formData,
      userId,
    };

    dispatch(setNewPassword(userData));
  };

  if (status === Status.Loading) {
    return <CircularProgress />;
  }

  return (
    <Paper elevation={0} sx={{ my: 5, mx: "auto", maxWidth: "1000px" }}>
      <Typography variant="h2">
        <KeyIcon fontSize="large" /> Set new password
      </Typography>
      <form onSubmit={onSubmit}>
        <TextField
          id="password"
          name="password"
          label="Enter your password"
          type="password"
          value={formData.password}
          onChange={onChange}
          required={true}
          size="medium"
          fullWidth
          sx={{ my: 1 }}
        />
        <TextField
          id="password1"
          name="password1"
          label="Enter your password"
          type="password"
          value={formData.password1}
          onChange={onChange}
          required={true}
          size="medium"
          fullWidth
          sx={{ my: 1 }}
        />
        <Button
          type="submit"
          size="large"
          variant="outlined"
          fullWidth
          sx={{ my: 1 }}>
          Set new password
        </Button>
      </form>
    </Paper>
  );
}

export default ForgottenPassword;
