import { Link } from "react-router-dom"

function Card({data}) {
  return (
      <div className="card">
        <div className="card-header"><img src="https://a6ad4808de.clvaw-cdnwnd.com/3fcec247b0b3f551f164ba2370f83229/200000532-3961c3961d/3D%20modelovani%202-58.jpg?ph=a6ad4808de" alt="kids programming" /></div>
        <div className="card-content">
            <p className="card-title">{data.title ? data.title : data.name}</p>
            <p>{data.description}</p>
        </div>
        <div className="card-footer">
            <p className="card-tag">{new Date(data.createdAt).toLocaleString("cs-CZ")}</p>
            <Link to={data._id} className="card-button">View detail</Link>
        </div>
    </div>
  )
}

export default Card