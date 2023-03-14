import {useState} from "react"
import {useDispatch} from "react-redux"
import {createCourse} from "../features/courses/courseSlice"
import Input from "./Input"

function CourseForm() {
  const [course, setState] = useState({title: "", description: ""})

  const dispatch = useDispatch()

  const onSubmit = e => {
    e.preventDefault()

    console.log(course);

    dispatch(createCourse(course))
    setState({})
  }

  const onChange = e => {
    const inputName = e.target.name

    setState({
      ...course,
      [inputName]: e.target.value,
    })
  }

  return (
    <section className="form">
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="text">Title</label>
                <input type="text" name="title" id="title" value={course.title} onChange={onChange} />
            </div>
            <Input id="description" value="" label="Description" placeholder="Short description of course" onChange={onChange} />
            <div className="form-group">
                <button className="btn btn-block" type="submit">Add course</button>
            </div>
        </form>
    </section>
  )
}

export default CourseForm