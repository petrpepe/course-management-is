import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import EmailIcon from "@mui/icons-material/Email";
import { sendEmail } from "../features/email/emailSlice";
import { Status } from "../features/Status";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";

function EmailPage() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    replyTo: "",
    subject: "",
    content: "",
  });

  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(sendEmail(formData));
  };

  if (status === Status.Loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Typography variant="h2">
        <EmailIcon fontSize="large" /> Send Emails to people
      </Typography>
      <Typography variant="body1">It can be send to whoever</Typography>
      <Paper elevation={0} sx={{ my: 5, mx: "auto", maxWidth: "1000px" }}>
        <form onSubmit={onSubmit}>
          <TextField
            id="from"
            name="from"
            label="Enter sender email:"
            value={formData.from}
            type="email"
            placeholder="example@domain.com"
            onChange={(e) => onChange(e)}
            required={true}
            size="medium"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            id="to"
            name="to"
            label="Enter recepient:"
            value={formData.to}
            type="email"
            placeholder="student@domain.com"
            onChange={(e) => onChange(e)}
            required={true}
            size="medium"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            id="replyTo"
            name="replyTo"
            label="Enter email, which user will reply to (optional):"
            value={formData.replyTo}
            type="email"
            placeholder="example@domain.com"
            onChange={(e) => onChange(e)}
            size="medium"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            id="subject"
            name="subject"
            label="Enter email subject:"
            value={formData.subject}
            placeholder="Subject"
            onChange={(e) => onChange(e)}
            required={true}
            size="medium"
            fullWidth
            sx={{ my: 1 }}
          />
          <TextField
            id="content"
            name="content"
            label="Enter message:"
            value={formData.content}
            multiline
            minRows={6}
            onChange={(e) => onChange(e)}
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
            Submit
          </Button>
        </form>
      </Paper>
    </>
  );
}

export default EmailPage;
