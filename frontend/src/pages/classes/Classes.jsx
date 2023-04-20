import {useEffect} from "react"
import {Link, useNavigate} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import Spinner from "../../components/Spinner"
import {deleteClass, getClasses, reset} from "../../features/classes/classSlice"
import Card from "../../components/Card"

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

  return (
    <>
      <section className="heading">
        <h1>Classes Dashboard</h1>
      </section>

      <section className="content">
        {user.roles.includes("admin") ? <Link to={"/classes/create"}>Create new Class</Link> : null}
        {isLoading ? <Spinner /> : classes.length > 0 ? (
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