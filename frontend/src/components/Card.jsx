import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FaPen, FaTrash } from "react-icons/fa"

function Card({data, title = "", link = "", imgSrc = "", currentData, deleteAction}) {
  const dispatch = useDispatch()
  const {user} = useSelector(state => state.auth)
  //dispatch(getUsers({ids: id, detail: true}))
  return (
      <div className="card">
        {imgSrc ? <div className="card-header"><img src={imgSrc} alt="kids programming" /></div> : ""}
        <div className="card-content">
            <p className="card-title">{title ? title : data.title}</p>
            {data.description ? <p>{data.description}</p> : ""}
        </div>
        <div className="card-footer">
            <p className="card-tag">{new Date(data.startDateTime ? data.startDateTime : data.createdAt).toLocaleString("cs-CZ")}</p>
            <Link to={link + data._id} state={currentData} className="card-button">View detail</Link>
            {user.roles.includes("admin") ? <>
              <Link to={link + data._id + "/edit"} state={currentData}><FaPen /></Link>
              <div onClick={() => dispatch(deleteAction(data._id))}><FaTrash /></div>
            </> : ""}
        </div>
    </div>
  )
}

export default Card