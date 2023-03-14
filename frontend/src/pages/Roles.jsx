import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import Spinner from "../components/Spinner"
import {getRoles, reset} from "../features/roles/roleSlice"

function Roles() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { roles, isLoading, isError, message } = useSelector((state) => state.roles)

  useEffect(() => {
    if(isError) {
      console.log(message);
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
        <h1>Welcome {user && user.firstName + " " + user.lastName}</h1>
        <p>Roles Dashboard</p>
      </section>

      <section className="content">
        {roles.length > 0 ? (
          <div className="cards">
            {roles.map((role) => (
                <div>
                    {JSON.stringify(role)}
                    <hr />
                </div>
            ))}
          </div>
        ) : ( 
          <h3>You haven't set any role</h3> 
          )}
      </section>
    </>
  )
}

export default Roles