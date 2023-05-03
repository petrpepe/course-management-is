import { FaBars, FaBookOpen, FaChalkboardTeacher, FaChevronDown, FaClock, FaLock, FaRegEnvelope, FaSignInAlt, FaSignOutAlt, FaUser, FaUserCircle, FaUserClock, FaUserFriends, FaUsers } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

function Header() {
  const navigate = useNavigate()
  const {user} = useSelector((state) => state.auth)

  const onLogout = () => {
    navigate("/logout")
  }

  const onClassToggle = (className) => {
    let x = document.querySelector(className);
    x.classList.toggle("responsive");
  }

  return (
    <header className="header">
        <ul>
            <li className="logo">
                <Link to="/">CourseSetter</Link>
            </li>
            {/*<button onClick={() => navigate(-1)}>Go Back</button>*/}
            <li className="left">
                <Link to="/classes">
                    <FaChalkboardTeacher />
                    Classes
                </Link>
            </li>
            <li className="left">
                <Link to="/timetable">
                    <FaClock />
                    Timetable
                </Link>
            </li>
            <li className="left">
                <Link to="/attendances">
                    <FaUserClock />
                    Attendances
                </Link>
            </li>
        </ul>
        <ul>
        {user ? (<>
            <li>
                <Link to="/courses">
                    <FaBookOpen />
                    Courses
                </Link>
            </li>
            <li>
                <Link to="/lessons">
                    <FaChalkboardTeacher />
                    Lessons
                </Link>
            </li>
            {!user.roles && !user.roles.includes("admin") ? "" : (
            <li className="dropdown" onClick={() => {if(window.innerWidth <= 1100) onClassToggle(".dropdown-content")}}>
                <div className="dropbtn">
                    <FaChevronDown />  Management
                </div>
                <div className="dropdown-content">
                    <Link to="/users">
                        <FaUsers /> Users
                    </Link>
                    <Link to="/roles">
                        <FaUserFriends /> Roles
                    </Link>
                    <Link to="/permissions">
                        <FaLock /> Permissions
                    </Link>
                    <Link to="/email">
                        <FaRegEnvelope /> Email
                    </Link>
                </div>
            </li>
            )}
            <li>
                <Link to="/me">
                    <FaUserCircle />
                    Profile
                </Link>
            </li>
            <li>
                <button className="btn" onClick={onLogout}>
                    <FaSignOutAlt />
                    Logout
                </button>
            </li>
        </>) : (<>
            <li>
                <Link to="/login">
                    <FaSignInAlt />
                    Login
                </Link>
            </li>
            <li>
                <Link to="/register">
                    <FaUser />
                    Register
                </Link>
            </li>
        </>)}
        <li className="res-icon" onClick={() =>onClassToggle(".header")}>
            <FaBars />
        </li>
        </ul>
    </header>
  )
}

export default Header