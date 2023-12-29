import { Link as ReactLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

function CustomCard({
  data,
  title = "",
  desc = "",
  link = "",
  imgSrc = "",
  deleteAction,
  deletePerm,
  editPerm,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <Card sx={{ width: { xs: 290, sm: 320 } }}>
      {imgSrc && (
        <CardMedia
          component="img"
          height="194"
          image={imgSrc}
          alt="Paella dish"
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title ? title : data.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ minHeight: "0.875rem" }}>
          {desc ? desc : data.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ justifyContent: "space-evenly" }}>
        <Button
          component={ReactLink}
          size="small"
          sx={{ p: "5px", pt: "6px" }}
          to={link + data._id}>
          View detail
        </Button>
        {user.rolePermissions.includes(editPerm) && (
          <Button
            component={ReactLink}
            size="small"
            sx={{ p: "5px", pt: "6px" }}
            to={link + data._id + "/edit"}>
            Edit
          </Button>
        )}
        {user.rolePermissions.includes(deletePerm) && (
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={() => dispatch(deleteAction(data._id))}>
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default CustomCard;
