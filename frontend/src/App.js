import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import AuthVerify from "./app/auth-verify";
import Login from "./pages/auth/Login";
import Logout from "./pages/auth/Logout";
import ForgottenPassword from "./pages/auth/ForgottenPassword";
import Users from "./pages/users/Users";
import UserDetail from "./pages/users/UserDetail";
import UserAction from "./pages/users/UserAction";
import Courses from "./pages/courses/Courses";
import CourseDetail from "./pages/courses/CourseDetail";
import CourseAction from "./pages/courses/CourseAction";
import Lessons from "./pages/lessons/Lessons";
import LessonDetail from "./pages/lessons/LessonDetail";
import LessonAction from "./pages/lessons/LessonAction";
import ClassCall from "./pages/classes/ClassCall";
import Classes from "./pages/classes/Classes";
import ClassDetail from "./pages/classes/ClassDetail";
import ClassAction from "./pages/classes/ClassAction";
//import Attendances from "./pages/Attendances";
import Roles from "./pages/Roles";
import Permissions from "./pages/Permissions";
import EmailPage from "./pages/EmailPage";
import Page404 from "./pages/Page404";
import { useSelector } from "react-redux";
import TimetablePage from "./pages/TimetablePage";
import { useMediaQuery } from "@mui/material";
import Paper from "@mui/material/Paper";
import { useMemo, useState } from "react";
import Profile from "./pages/users/Profile";
import Attendances from "./pages/Attendances";

export const ProtectedRoute = ({ perm, children }) => {
  const { user } = useSelector((state) => state.auth);

  return user && user.rolePermissions && user.rolePermissions.includes(perm) ? (
    children
  ) : (
    <Page404 />
  );
};

function App() {
  const { user } = useSelector((state) => state.auth);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkTheme, setDarkTheme] = useState(prefersDarkMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkTheme ? "dark" : "light",
        },
      }),
    [darkTheme]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthVerify />
        <Paper elevation={0} sx={{ m: 5, textAlign: "center" }}>
          <Header darkTheme={darkTheme} setDarkTheme={setDarkTheme} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login/:userEmail" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route
              path="/forgottenPassword/:token"
              element={<ForgottenPassword />}
            />
            {user && (
              <>
                <Route
                  path="/users/create"
                  element={
                    <ProtectedRoute perm="userCreate">
                      <UserAction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute perm="userGet">
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/me"
                  element={
                    <ProtectedRoute perm="userGet">
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users/:id"
                  element={
                    <ProtectedRoute perm="userGet">
                      <UserDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users/:id/edit"
                  element={
                    <ProtectedRoute perm="userUpdate">
                      <UserAction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/create"
                  element={
                    <ProtectedRoute perm="courseCreate">
                      <CourseAction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute perm="courseGet">
                      <Courses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:id"
                  element={
                    <ProtectedRoute perm="courseGet">
                      <CourseDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:id/edit"
                  element={
                    <ProtectedRoute perm="courseUpdate">
                      <CourseAction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lessons/create"
                  element={
                    <ProtectedRoute perm="lessonCreate">
                      <LessonAction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lessons"
                  element={
                    <ProtectedRoute perm="lessonGet">
                      <Lessons />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lessons/:id"
                  element={
                    <ProtectedRoute perm="lessonGet">
                      <LessonDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lessons/:id/edit"
                  element={
                    <ProtectedRoute perm="lessonUpdate">
                      <LessonAction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/classes/create"
                  element={
                    <ProtectedRoute perm="classCreate">
                      <ClassAction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/classes"
                  element={
                    <ProtectedRoute perm="classGet">
                      <Classes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/classes/:id"
                  element={
                    <ProtectedRoute perm="classGet">
                      <ClassDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/classes/call/:id"
                  element={
                    <ProtectedRoute perm="classGet">
                      <ClassCall />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/classes/:id/edit"
                  element={
                    <ProtectedRoute perm="classUpdate">
                      <ClassAction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/timetable/:id?/:specId?"
                  element={
                    <ProtectedRoute perm="timetablesGet">
                      <TimetablePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/attendances/:id?/:specId?"
                  element={
                    <ProtectedRoute perm="attendanceGet">
                      <Attendances />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/roles"
                  element={
                    <ProtectedRoute perm="rolesManagement">
                      <Roles />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/permissions"
                  element={
                    <ProtectedRoute perm="permissionsManagement">
                      <Permissions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/email"
                  element={
                    <ProtectedRoute perm="sendEmails">
                      <EmailPage />
                    </ProtectedRoute>
                  }
                />
              </>
            )}
            <Route path="*" element={<Page404 />} />
          </Routes>
          <Footer />
        </Paper>
      </Router>
    </ThemeProvider>
  );
}

export default App;
