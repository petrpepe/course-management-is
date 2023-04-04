import {useEffect} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {useSelector, useDispatch} from "react-redux"
import {toast} from "react-toastify"
import Spinner from "../../components/Spinner"
import {getClasses, reset} from "../../features/classes/classSlice"

function ClassDetail() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const id = useParams().id
  const { classes, isLoading, isError, message } = useSelector((state) => state.classes)
  
  useEffect(() => {
    if(isError) {
      toast.error(message)
    }

    dispatch(getClasses())

    return () => {
      dispatch(reset())
    }
  }, [id, navigate, isError, message, dispatch])

  if (isLoading || classes.length === 0) {
    return <Spinner />
  }

  const classVar = classes[0]

  return (
    <>
      <section className="heading">
        <h1>Class: {classVar.title}</h1>
        <p>{classVar.desctiption}</p>
      </section>

      <section className="content">
        <p>{Object.values(classVar)}</p>
      </section>
    </>
  )
}

export default ClassDetail