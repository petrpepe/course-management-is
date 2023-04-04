import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Logout from './pages/Logout'
import UserAction from './pages/users/UserAction'
import Header from "./components/Header"
import Lessons from "./pages/lessons/Lessons"
import Attendances from "./pages/Attendances"
import UserDetail from "./pages/users/UserDetail"
import Permissions from "./pages/Permissions"
import Roles from "./pages/Roles"
import CourseDetail from './pages/courses/CourseDetail'
import AuthVerify from "./app/auth-verify"
import ClassAction from "./pages/classes/ClassAction"
import ClassDetail from "./pages/classes/ClassDetail"
import Classes from "./pages/classes/Classes"

function App() {
//me route profile pridat param do Users/Userdetail? easy edit
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
            <Route path="/users" element={<Dashboard />} />
            <Route path="/users/create" element={<UserAction />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/users/:id/edit" element={<UserAction />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/classes/create" element={<ClassAction />} />
            <Route path="/classes/:id" element={<ClassDetail />} />
            <Route path="/classes/:id/edit" element={<ClassAction />} />
            <Route path="/courses" element={<Dashboard />} />
            <Route path="/courses/create" element={<CourseDetail />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/courses/:id/edit" element={<CourseDetail />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lessons/create" element={<CourseDetail />} />
            <Route path="/lessons/:id" element={<CourseDetail />} />
            <Route path="/lessons/:id/edit" element={<CourseDetail />} />
            <Route path="/attendances" element={<Attendances />} />
            <Route path="/attendances/create" element={<CourseDetail />} />
            <Route path="/attendances/:id" element={<CourseDetail />} />
            <Route path="/attendances/:id/edit" element={<CourseDetail />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/roles/create" element={<CourseDetail />} />
            <Route path="/roles/:id" element={<CourseDetail />} />
            <Route path="/roles/:id/edit" element={<CourseDetail />} />
            <Route path="/permissions" element={<Permissions />} />
          </Routes>
        </main>
        <AuthVerify />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
