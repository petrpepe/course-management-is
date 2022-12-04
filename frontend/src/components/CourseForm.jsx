import {useState} from "react"
import {useDispatch} from "react-redux"
import {createCourse} from "../features/courses/courseSlice"

function CourseForm() {
  const [name, setText] = useState("")

  const dispatch = useDispatch()

  const onSubmit = e => {
    e.preventDefault()

    dispatch(createCourse({name}))
    setText("")
  }

  return (
    <section className="form">
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="text">Course</label>
                <input type="text" name="name" id="name" value={name} onChange={(e) => setText(e.target.value)} />
            </div>
            <div className="form-group">
                <button className="btn btn-block" type="submit">Add course</button>
            </div>
        </form>
    </section>
  )
}

export default CourseForm