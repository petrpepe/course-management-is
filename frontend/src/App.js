import {BrowserRouter as Router, Routes, Route, Outlet} from "react-router-dom"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Header from "./components/Header"
import Dashboard from './pages/Dashboard'
import AuthVerify from "./app/auth-verify"
import Login from './pages/auth/Login'
import Logout from './pages/auth/Logout'
import ForgottenPassword from "./pages/auth/ForgottenPassword"
import Users from "./pages/users/Users"
import UserDetail from "./pages/users/UserDetail"
import UserAction from './pages/users/UserAction'
import Courses from "./pages/courses/Courses"
import CourseDetail from './pages/courses/CourseDetail'
import CourseAction from './pages/courses/CourseAction'
import Lessons from "./pages/lessons/Lessons"
import LessonDetail from "./pages/lessons/LessonDetail"
import LessonAction from "./pages/lessons/LessonAction"
import LessonCall from "./pages/lessons/LessonCall"
import Classes from "./pages/classes/Classes"
import ClassDetail from "./pages/classes/ClassDetail"
import ClassAction from "./pages/classes/ClassAction"
import Attendances from "./pages/Attendances"
import Roles from "./pages/Roles"
import Permissions from "./pages/Permissions"
import EmailPage from "./pages/EmailPage"
import Page404 from "./pages/Page404"
import { useSelector } from "react-redux"
import Timetable from "./pages/Timetable"

export const ProtectedRoute = ({
  isAllowed,
}) => {
  return (
      isAllowed ? <Outlet /> : <Page404 />
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
            <Route path="/login" element={<Login />} />
            <Route path="/login/:userEmail" element={<Login />} />
            <Route path="/logout" element={<Logout/>} />
            <Route path="/:userId/:token" element={<ForgottenPassword />} />
            {user ? <>
            <Route path="users" element={<ProtectedRoute isAllowed={user.roles} />}>
                <Route index element={<Users />} />
                <Route path=":id" element={<UserDetail />} />
                <Route path=":id/edit" element={<UserAction />} />
            </Route>
            <Route path="users" element={<ProtectedRoute isAllowed={user.roles && user.roles.includes("admin")} />}>
                <Route path="create" element={<UserAction />} />
            </Route>
            <Route path="courses" element={<ProtectedRoute isAllowed={user.roles} />}>
                <Route index element={<Courses />} />
                <Route path=":id" element={<CourseDetail />} />
            </Route>
            <Route path="courses" element={<ProtectedRoute isAllowed={user.roles && user.roles.includes("admin")} />}>
                <Route path="create" element={<CourseAction />} />
                <Route path=":id/edit" element={<CourseAction />} />
            </Route>
            <Route path="lessons" element={<ProtectedRoute isAllowed={user.roles} />}>
                <Route index element={<Lessons />} />
                <Route path=":id" element={<LessonDetail />} />
                <Route path="call" element={<LessonCall />} />
            </Route>
            <Route path="lessons" element={<ProtectedRoute isAllowed={user && user.roles && (user.roles.includes("admin") || user.roles.includes("lector"))} />}>
              <Route path="create" element={<LessonAction />} />
              <Route path=":id/edit" element={<LessonAction />} />
            </Route>
            <Route path="classes" element={<ProtectedRoute isAllowed={user.roles} />}>
              <Route index element={<Classes />} />
              <Route path=":id" element={<ClassDetail />} />
            </Route>
            <Route path="classes" element={<ProtectedRoute isAllowed={user.roles && user.roles.includes("admin")} />}>
              <Route path="create" element={<ClassAction />} />
              <Route path=":id/edit" element={<ClassAction />} />
            </Route>
            <Route element={<ProtectedRoute isAllowed={user.roles} />}>
              <Route path="/me" element={<UserDetail />} />
              <Route path="/attendances" element={<Attendances />} />
              <Route path="/timetable" element={<Timetable />} />
            </Route>
            <Route element={<ProtectedRoute isAllowed={user.roles && user.roles.includes("admin")} />}>
              <Route path="/timetable/:id" element={<Timetable />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/permissions" element={<Permissions />} />
              <Route path="/email" element={<EmailPage />} />
            </Route>
            </>: null}
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
