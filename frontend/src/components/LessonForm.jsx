import {useState} from "react"
import {useDispatch} from "react-redux"
import {createLesson} from "../features/lessons/lessonSlice"

function LessonForm() {
  const [lesson, setState] = useState({title: "", description: ""})

  const dispatch = useDispatch()

  const onSubmit = e => {
    e.preventDefault()

    console.log(lesson);

    dispatch(createLesson(lesson))
    setState({})
  }

  const onChange = e => {
    const inputName = e.target.name

    setState({
      ...lesson,
      [inputName]: e.target.value,
    })
  }

  return (
    <section className="form">
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="text">Title</label>
                <input type="text" name="title" id="title" value={lesson.title} onChange={onChange} />
            </div>
            <div className="form-group">
                <label htmlFor="text">Description</label>
                <input type="text" name="description" id="description" value={lesson.description} onChange={onChange} />
            </div>
            <div className="form-group">
                <button className="btn btn-block" type="submit">Add lesson</button>
            </div>
        </form>
    </section>
  )
}

export default LessonForm