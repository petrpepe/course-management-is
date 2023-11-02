import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { Link as ReactLink } from "react-router-dom";

function CreateNewEntryLink({ linkText, linkTo, perm }) {
  const { user } = useSelector((state) => state.auth);

  if (user.rolePermissions.includes(perm)) {
    return (
      <Button component={ReactLink} to={linkTo}>
        {linkText}
      </Button>
    );
  }
}

export default CreateNewEntryLink;
