import { useNavigate } from "react-router-dom"

function Page404() {
    const navigate = useNavigate()
    return (<>
        <h1>404 Not found</h1>
        <button onClick={() => navigate(-1)} className="btn btn-block">Go Back</button>
    </>)
}

export default Page404