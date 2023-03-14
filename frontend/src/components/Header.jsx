import { FaBookOpen, FaChalkboardTeacher, FaClock, FaLock, FaSignInAlt, FaSignOutAlt, FaUser, FaUserCircle, FaUserFriends, FaUsers } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout, reset } from "../features/auth/authSlice"

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {user} = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate("/")
  }

  return (
    <header className="header">
        <div className="logo">
            <Link to="/">CourseSetter</Link>
        </div>
        <ul>
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
            {!user || !user.permsRoles ? "" :
            <>
                <li>
                    <Link to="/attendances">
                        <FaClock />
                        Attendances
                    </Link>
                </li>
                {!user.permsRoles.userRoles.includes("admin") ? "" : (
                        <>
                        <li>
                            <Link to="/users">
                                <FaUsers />
                                Users
                            </Link>
                        </li>
                        <li>
                            <Link to="/roles">
                                <FaUserFriends />
                                Roles
                            </Link>
                        </li>
                        <li>
                            <Link to="/permissions">
                                <FaLock />
                                Permissions
                            </Link>
                        </li>
                        </>
                    )}
                </>
            }
            
            {user ? (
                <>
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
                </>
            ) : (
                <>
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
                </>
            )}
        </ul>
    </header>
  )
}

export default Header