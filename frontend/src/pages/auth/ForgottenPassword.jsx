import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import KeyIcon from "@mui/icons-material/Key";
import { setNewPassword } from "../../features/auth/authSlice";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

function ForgottenPassword() {
  const [formData, setFormData] = useState({
    password: "",
    password1: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      ...formData,
      token,
    };

    dispatch(setNewPassword(userData));
    navigate("/login");
  };

  return (
    <Paper elevation={0} sx={{ my: 5, mx: "auto", maxWidth: "1000px" }}>
      <Typography variant="h3" component="h1">
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
