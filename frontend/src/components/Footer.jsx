import Button from "@mui/material/Button"
import { useNavigate } from "react-router-dom"

function Footer() {
  const navigate = useNavigate()
  return (
    <Button onClick={() => navigate("/lessons")} sx={{position: "fixed", bottom: "10px", right: "10px"}} >Go back</Button>
  )
}

export default Footer