import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import {getRoles, reset} from "../features/roles/roleSlice"
import Spinner from "../components/Spinner"
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
    
    if(!user) {
      navigate("/login")
      return
    }

    dispatch(getRoles())

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className="heading">
        <h1>Roles</h1>
      </section>

      <section className="content">
        <Table roles={roles} />
      </section>
    </>
  )
}

export default Roles