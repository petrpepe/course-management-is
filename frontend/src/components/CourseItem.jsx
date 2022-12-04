import { useDispatch } from "react-redux"
import { deleteCourse } from "../features/courses/courseSlice"

function CourseItem({course}) {
  const dispatch = useDispatch()
  
  return (
    <div className="goal">
        <div>
            {new Date(course.createdAt).toLocaleString("cs-CZ")}
        </div>
        <h2>{course.name}</h2>
        <button onClick={() => dispatch(deleteCourse(course._id))} className="close">X</button>
    </div>
  )
}

export default CourseItem