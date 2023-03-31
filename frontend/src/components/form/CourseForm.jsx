import {useState} from "react"
import {useDispatch} from "react-redux"
import {createCourse} from "../../features/courses/courseSlice"
import Input from "./Input"

function CourseForm() {
  const [course, setState] = useState({title: "", description: ""})

  const dispatch = useDispatch()

  const onSubmit = e => {
    e.preventDefault()

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
            <Input id="title" value={course.title} label="Title" placeholder="Title of course" onChange={onChange} required={true} />
            <Input id="description" value={course.description} label="Description" placeholder="Short description of course" onChange={onChange} />
            <div className="form-group">
                <button className="btn btn-block" type="submit">Add course</button>
            </div>
        </form>
    </section>
  )
}

export default CourseForm