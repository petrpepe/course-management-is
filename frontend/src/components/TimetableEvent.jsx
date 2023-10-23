import {Link as ReactLink} from "react"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"

function TimetableEvent({event}) {

    return (
    <ListItem key={event._id} sx={{width: {xs: "100%", md: "50%",lg: "33%"}, display: "block"}}>
        <ListItemButton component={ReactLink} to={"/classes/call"} sx={{ color: '#fff' }}>
            <ListItemText primary={event.title} secondary={event.dateTime} />
        </ListItemButton>
    </ListItem>
    )
}

export default TimetableEvent