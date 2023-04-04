import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import Spinner from "../../components/Spinner"
import {getUsers, reset} from "../../features/users/userSlice"

function Users() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { users, isLoading, isError, message } = useSelector((state) => state.users)

  useEffect(() => {
    if(isError) {
      toast.error(message)
    }
    
    if(!user) {
      navigate("/login")
      return
    }

    dispatch(getUsers())

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
        <p>Users Dashboard</p>
      </section>

      <section className="content">
        {users.length > 0 ? (
          <div className="cards">
            {users.map((user) => (
                <div>
                    {JSON.stringify(user)}
                    <hr />
                </div>
            ))}
          </div>
        ) : ( 
          <h3>You haven't set any user</h3> 
          )}
      </section>
    </>
  )
}

export default Users