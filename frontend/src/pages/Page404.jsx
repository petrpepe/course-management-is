import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { useNavigate } from "react-router-dom"

function Page404() {
    const navigate = useNavigate()
    return (<>
        <Typography variant="h2">404 Not found or 403 not authorized</Typography>
        <Button onClick={() => navigate(-1)} size="large" variant="outlined" fullWidth sx={{my: 1}}>Go Back</Button>
    </>)
}

export default Page404