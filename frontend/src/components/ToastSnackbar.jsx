import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import { Status } from "../features/Status";

const ToastSnackbar = ({ status, message }) => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("info");

  useEffect(() => {
    if (status === Status.Error) {
      setOpen(true);
      setSeverity("error");
    }
  }, [status, setOpen]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastSnackbar;
