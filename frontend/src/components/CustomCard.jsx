import { Link as ReactLink, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';

function CustomCard({data, title = "", link = "", imgSrc = "", deleteAction}) {
  const dispatch = useDispatch()
  const {user} = useSelector(state => state.auth)
  const location = useLocation()

  return (
    <Card sx={{ maxWidth: 345 }}>
      {imgSrc && <CardMedia
        component="img"
        height="194"
        image={imgSrc}
        alt="Paella dish"
      /> }
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title ? title : data.title}
        </Typography> 
        <Typography variant="body2" color="text.secondary" sx={{minHeight: "0.875rem"}}>
          {data.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button component={ReactLink} size="small" to={link + data._id}>View detail</Button> 
        {(user.roles.includes("admin") || (user.roles.includes("lector") && location.pathname.includes("lessons"))) &&
          <Button component={ReactLink} size="small" to={link + data._id + "/edit"} state={{data}}>Edit</Button>}
        {user.roles.includes("admin") && <Button variant="outlined" startIcon={<DeleteIcon  />} 
          onClick={() => dispatch(deleteAction(data._id))} >
          Delete
        </Button>}
      </CardActions>
    </Card>
  )
}

export default CustomCard