import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import {deleteClass, getClasses, reset} from "../features/classes/classSlice"
import Spinner from "../components/Spinner"
import Card from "../components/Card"

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { classes, isLoading, isError, message } = useSelector((state) => state.classes)

  useEffect(() => {
    if(isError) {
      toast.error(message);
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


  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.firstName + " " + user.lastName}</h1>
        <p>Main Dashboard</p>
      </section>

      {isLoading ? <Spinner /> :
        <section className="content">
          {classes.length > 0 ? (
            <div className="cards">
              {classes.map((classVar) => (
                <Card key={classVar._id} data={classVar} currentData={{currentClass: classVar}} link="/classes/" deleteAction={deleteClass} />
              ))}
            </div>
          ) : ( 
            <h3>You don't have any class today</h3> 
            )}
        </section>
      }
    </>
  )
}

export default Dashboard