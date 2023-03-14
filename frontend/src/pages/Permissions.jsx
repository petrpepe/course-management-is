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
      console.log(message);
    }
    
    if(!user) {
      navigate("/login")
      return
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
        <h1>Welcome {user && user.firstName + " " + user.lastName}</h1>
        <p>Permissions Dashboard</p>
      </section>

      <section className="content">
        {permissions.length > 0 ? (
          <div className="cards">
            {permissions.map((permission) => (
                <div>
                    {JSON.stringify(permission)}
                    <hr />
                </div>
            ))}
          </div>
        ) : ( 
          <h3>You haven't set any permission</h3> 
          )}
      </section>
    </>
  )
}

export default Permissions