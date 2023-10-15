import {getRoles, reset as resetRoles} from "../features/roles/roleSlice"
import RoleTable from "../components/table/RoleTable"
import useGetData from "../hooks/useGetData"
import Typography from "@mui/material/Typography"

function Roles() {

  const { roles, status } = useGetData("roles", getRoles, resetRoles)

  return (
    <>
      <section className="heading">
        <Typography variant="h2" >Roles</Typography>
      </section>

      <section className="content">
        <RoleTable roles={roles} rolesStatus={status}/>
      </section>
    </>
  )
}

export default Roles