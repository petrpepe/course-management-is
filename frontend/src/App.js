import {BrowserRouter as Router, Routes, Route, Navigate, Outlet} from "react-router-dom"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Header from "./components/Header"
import Dashboard from './pages/Dashboard'
import AuthVerify from "./app/auth-verify"
import Login from './pages/Login'
import Logout from './pages/Logout'
import Users from "./pages/users/Users"
import UserDetail from "./pages/users/UserDetail"
import UserAction from './pages/users/UserAction'
import Courses from "./pages/courses/Courses"
import CourseDetail from './pages/courses/CourseDetail'
import CourseAction from './pages/courses/CourseAction'
import Classes from "./pages/classes/Classes"
import ClassDetail from "./pages/classes/ClassDetail"
import ClassAction from "./pages/classes/ClassAction"
import Lessons from "./pages/lessons/Lessons"
import LessonDetail from "./pages/lessons/LessonDetail"
import LessonAction from "./pages/lessons/LessonAction"
import Attendances from "./pages/Attendances"
import Roles from "./pages/Roles"
import Permissions from "./pages/Permissions"
import EmailPage from "./pages/EmailPage"
import Page404 from "./pages/Page404"
import { useSelector } from "react-redux"
import LessonCall from "./pages/lessons/LessonCall"
import Timetable from "./pages/Timetable"

const ProtectedRoute = ({
  isAllowed,
  redirectPath = '/',
}) => {
  return (
      isAllowed ? <Outlet /> : <Navigate to={redirectPath} replace/>
  )
};

function App() {
  const {user} = useSelector(state => state.auth)

  return (
    <>
      <Router>
        <main className="container">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login isLogout={false}/>} />
            <Route path="/logout" element={<Logout/>} />
            <Route path="/me" element={<UserDetail />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lessons/:id" element={<LessonDetail />} />
            <Route path="/lessons/call" element={<LessonCall />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/classes/:id" element={<ClassDetail />} />
            <Route path="/attendances" element={<Attendances />} />
            <Route path="/users/:id/edit" element={<UserAction />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route element={<ProtectedRoute isAllowed={user && user.roles && user.roles.includes("admin")} />}>
              <Route path="/timetable/:id" element={<Timetable />} />
              <Route path="/users/create" element={<UserAction />} />
              <Route path="/courses/create" element={<CourseAction />} />
              <Route path="/courses/:id/edit" element={<CourseAction />} />
              <Route path="/classes/create" element={<ClassAction />} />
              <Route path="/classes/:id/edit" element={<ClassAction />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/permissions" element={<Permissions />} />
              <Route path="/email" element={<EmailPage />} />
            </Route>
            <Route element={<ProtectedRoute isAllowed={user && user.roles && (user.roles.includes("admin") || user.roles.includes("lector"))} />}>
              <Route path="/lessons/create" element={<LessonAction />} />
              <Route path="/lessons/:id/edit" element={<LessonAction />} />
            </Route>
            <Route path="*" element={<Page404 />} />
          </Routes>
        </main>
        <AuthVerify />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
