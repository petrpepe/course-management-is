import { useSelector } from "react-redux";
import {
  deleteClass,
  getClasses,
  reset as resetClasses,
} from "../features/classes/classSlice";
import CustomCard from "../components/CustomCard";
import { Status } from "../features/Status";
import useGetData from "../hooks/useGetData";
import { useEffect } from "react";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const { classes, status } = useGetData("classes", getClasses, resetClasses);

  useEffect(() => {
    if (!user) {
      return console.log("Přihlaš se");
    }
  }, [user]);
  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.firstName + " " + user.lastName}</h1>
        <p>Main Dashboard</p>
      </section>

      <section className="content">
        {classes.length > 0 && status === Status.Success ? (
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
          <h3>You don't have any class today</h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;
