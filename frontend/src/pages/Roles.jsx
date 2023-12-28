import { getRoles, reset as resetRoles } from "../features/roles/roleSlice";
import RoleTable from "../components/table/RoleTable";
import useGetData from "../hooks/useGetData";
import Typography from "@mui/material/Typography";

function Roles() {
  const { roles, status } = useGetData("roles", getRoles, resetRoles);

  return (
    <>
      <Typography variant="h3" component="h1">
        Roles
      </Typography>
      <RoleTable roles={roles} rolesStatus={status} />
    </>
  );
}

export default Roles;
