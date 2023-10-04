import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/auth/authSlice"
import courseReducer from "../features/courses/courseSlice"
import lessonReducer from "../features/lessons/lessonSlice"
import attendanceReducer from "../features/attendances/attendanceSlice"
import userReducer from "../features/users/userSlice"
import permissionReducer from "../features/permissions/permissionSlice"
import roleReducer from "../features/roles/roleSlice"
import classReducer from "../features/classes/classSlice"
import emailReducer from "../features/email/emailSlice"
import providerReducer from "../features/providers/providerSlice"
import timetableReducer from "../features/timetables/timetableSlice"
import enrollmentReducer from "../features/enrollments/enrollmentSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    lessons: lessonReducer,
    attendances: attendanceReducer,
    users: userReducer,
    permissions: permissionReducer,
    roles: roleReducer,
    classes: classReducer,
    email: emailReducer,
    providers: providerReducer,
    timetables: timetableReducer,
    enrollments: enrollmentReducer,
  },
})
