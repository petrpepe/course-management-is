import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import Spinner from "../../components/Spinner"
import {getClasses, reset} from "../../features/classes/classSlice"

function Classes() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { classes, isLoading, isError, message } = useSelector((state) => state.classes)

  useEffect(() => {
    if(isError) {
      toast.error(message)
    }
    
    if(!user) {
      navigate("/login")
      return
    }

    dispatch(getClasses())

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
        <p>Classes Dashboard</p>
      </section>

      <section className="content">
        {classes.length > 0 ? (
          <div className="cards">
            {classes.map((classVar) => (
                <div>
                    {JSON.stringify(classVar)}
                    <hr />
                </div>
            ))}
          </div>
        ) : ( 
          <h3>You haven't set any class</h3> 
          )}
      </section>
    </>
  )
}

export default Classes