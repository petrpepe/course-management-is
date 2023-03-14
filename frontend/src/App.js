import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Header from "./components/Header"
import Lessons from "./pages/Lessons";
import Attendances from "./pages/Attendances";
import User from "./pages/User";
import Permissions from "./pages/Permissions";
import Roles from "./pages/Roles";
import CourseDetail from './pages/CourseDetail'

function App() {
  return (
    <>
      <Router>
        <main className="container">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/me" element={<User />} />
            <Route path="/courses" element={<Dashboard />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/attendances" element={<Attendances />} />
            <Route path="/users" element={<User />} />
            <Route path="/permissions" element={<Permissions />} />
            <Route path="/roles" element={<Roles />} />
          </Routes>
        </main>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
