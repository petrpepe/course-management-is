import {useEffect} from "react"
import {useNavigate, useParams, Link} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import Spinner from "../../components/Spinner"
import {getUsers, reset} from "../../features/users/userSlice"

function Users() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { users, isLoading, isError, message } = useSelector((state) => state.users)
  const { id } = useParams()

  useEffect(() => {
    if(isError) {
      toast.error(message)
    }

    if(!user) {
      navigate("/login")
      return
    }

    if(id) dispatch(getUsers({ids: id, detail: true}))

    return () => {
      dispatch(reset())
    }
  }, [user, id, navigate, isError, message, dispatch])

  if (isLoading || (id && !users[0])) {
    return <Spinner />
  }

  let currentUser = user
  if(id) currentUser = users[0]

  return (
    <>
    {currentUser != null ?
      <>
        <section className="heading">
          <h1>{id ? "Profile: " + currentUser.firstName + " " + currentUser.lastName : "Your profile"}</h1>
        </section>

        <section className="content">
          <div><p>Whole name: {currentUser.firstName + (currentUser.otherNames ? " " + currentUser.otherNames.join(" ") + " " : " ") + currentUser.lastName}</p></div>
          <div><p>Email: {currentUser.email}</p></div>
          <div><p>{currentUser.phone.length > 0 ? <>Phone:
            {currentUser.phone.map(phone => " " + phone.type + ": " + phone.phone)}
          </>: null}</p></div>
          <Link to={"/users/" + currentUser._id + "/edit"} state={{currentUser: currentUser}}>Edit</Link>
        </section>
      </>
    : "No such an user"}
    </>
  )
}

export default Users