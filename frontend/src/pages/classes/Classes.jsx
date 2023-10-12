import {useEffect} from "react"
import {Link} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import Spinner from "../../components/Spinner"
import {deleteClass, getClasses, reset} from "../../features/classes/classSlice"
import Card from "../../components/Card"
import Search from "../../components/Search"
import { Status } from "../../features/Status"

function Classes() {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { classes, status, message } = useSelector((state) => state.classes)

  useEffect(() => {
    if (status === Status.Idle) {
      dispatch(getClasses())
    }
  }, [status, message, dispatch])

  return (
    <>
      <section className="heading">
        <h1>Classes Dashboard</h1>
      </section>

      <section className="content">
        <Search getData={getClasses} reset={reset} />
        {user.roles.includes("admin") ? <Link to={"/classes/create"}>Create new Class</Link> : null}
        {status === Status.Loading ? <Spinner /> : classes.length > 0 ? (
          <div className="cards">
            {classes.map((classVar) => (
              <Card key={classVar._id} data={classVar} link="/classes/" currentData={{currentClass: classVar}} deleteAction={deleteClass} />
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