import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import {getRoles, reset} from "../features/roles/roleSlice"
import Table from "../components/table/Table"

function Roles() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { roles, isLoading, isError, message } = useSelector((state) => state.roles)

  useEffect(() => {
    if(isError) {
      toast.error(message)
    }

    dispatch(getRoles())

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])

  return (
    <>
      <section className="heading">
        <h1>Roles</h1>
      </section>

      <section className="content">
        <Table roles={roles} isRolesLoading={isLoading}/>
      </section>
    </>
  )
}

export default Roles