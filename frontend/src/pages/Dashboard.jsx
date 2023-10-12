import {useEffect} from "react"
import {useSelector, useDispatch} from "react-redux"
import {deleteClass, getClasses} from "../features/classes/classSlice"
import Spinner from "../components/Spinner"
import Card from "../components/Card"
import { Status } from "../features/Status"

function Dashboard() {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { classes, status, message } = useSelector((state) => state.classes)

  useEffect(() => {
    if (status === Status.Idle) {
      dispatch(getClasses())
    }
  }, [status, message, dispatch])

  if(status === Status.Loading) return <Spinner />

  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.firstName + " " + user.lastName}</h1>
        <p>Main Dashboard</p>
      </section>

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
    </>
  )
}

export default Dashboard