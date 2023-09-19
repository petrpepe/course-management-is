import { useNavigate } from "react-router-dom"

function Page404() {
    const navigate = useNavigate()
    return (<>
        <h1>404 Not found or 403 not authorized</h1>
        <button onClick={() => navigate(-1)} className="btn btn-block">Go Back</button>
    </>)
}

export default Page404