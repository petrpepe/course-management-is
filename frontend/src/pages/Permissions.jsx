import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import Spinner from "../components/Spinner"
import {getPermissions, reset} from "../features/permissions/permissionSlice"

function Permissions() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { permissions, isLoading, isError, message } = useSelector((state) => state.permissions)

  useEffect(() => {
    if(isError) {
    }

    dispatch(getPermissions())

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
        <h1>Permissions Dashboard</h1>
      </section>

      <section className="content">
        {permissions.length > 0 ? (
          <div className="table-wrapper">
          <table className="res-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission) => (
                <tr key={permission._id}>
                  <td>{permission.name}</td>
                  <td>{permission.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : ( 
          <h3>You haven't set any permission</h3> 
          )}
      </section>
    </>
  )
}

export default Permissions