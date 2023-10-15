import {Link} from "react-router-dom"
import {useSelector} from "react-redux"
import Spinner from "../../components/Spinner"
import {deleteClass, getClasses, reset as resetClasses} from "../../features/classes/classSlice"
import CustomCard from "../../components/CustomCard"
import Search from "../../components/Search"
import { Status } from "../../features/Status"
import useGetData from "../../hooks/useGetData"
import Typography from "@mui/material/Typography"

function Classes() {
  const { user } = useSelector((state) => state.auth)
  const { classes, status } = useGetData("classes", getClasses, resetClasses)

  return (
    <>
      <section className="heading">
        <Typography variant="h2">Classes Dashboard</Typography>
      </section>

      <section className="content">
        <Search getData={getClasses} reset={resetClasses} />
        {user.roles.includes("admin") && <Link to={"/classes/create"}>Create new Class</Link>}
        {status === Status.Loading ? <Spinner /> : classes.length > 0 ? (
          <div className="cards">
            {classes.map((classVar) => (
              <CustomCard key={classVar._id} data={classVar} link="/classes/" deleteAction={deleteClass} />
            ))}
          </div>
        ) : ( 
          <Typography variant="h4">You haven't set any class</Typography> 
        )}
      </section>
    </>
  )
}

export default Classes