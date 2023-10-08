import {useEffect} from "react"
import {useSelector, useDispatch} from "react-redux"
import {getRoles} from "../features/roles/roleSlice"
import RoleTable from "../components/table/RoleTable"
import { Status } from "../features/Status"

function Roles() {
  const dispatch = useDispatch()

  const { roles, status, message } = useSelector((state) => state.roles)

  useEffect(() => {
    if(status === Status.Idle) {
      dispatch(getRoles())
    }
  }, [status, message, dispatch])

  return (
    <>
      <section className="heading">
        <h1>Roles</h1>
      </section>

      <section className="content">
        <RoleTable roles={roles} rolesStatus={status}/>
      </section>
    </>
  )
}

export default Roles