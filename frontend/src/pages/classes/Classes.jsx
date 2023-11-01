import { Link as ReactLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  deleteClass,
  getClasses,
  reset as resetClasses,
} from "../../features/classes/classSlice";
import CustomCard from "../../components/CustomCard";
import Search from "../../components/Search";
import { Status } from "../../features/Status";
import useGetData from "../../hooks/useGetData";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

function Classes() {
  const { user } = useSelector((state) => state.auth);
  const { classes, status } = useGetData("classes", getClasses, resetClasses);

  return (
    <>
      <Typography variant="h2">Classes Dashboard</Typography>
      <Search getData={getClasses} resetData={resetClasses} />
      {user.roles.includes("admin") && (
        <Button
          component={ReactLink}
          to="/classes/create"
          sx={{ color: "#fff" }}
        >
          Create new Class
        </Button>
      )}

      {status === Status.Loading ? (
        <CircularProgress />
      ) : classes.length > 0 ? (
        <div className="cards">
          {classes.map((classVar) => (
            <CustomCard
              key={classVar._id}
              data={classVar}
              link="/classes/"
              deleteAction={deleteClass}
            />
          ))}
        </div>
      ) : (
        <Typography variant="h3">
          You are not enrolled in any classes
        </Typography>
      )}
    </>
  );
}

export default Classes;
