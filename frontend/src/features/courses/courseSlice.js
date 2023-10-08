import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import courseService from "./courseService"
import { Status } from "../Status"

const initialState = {
    courses: [],
    status: Status.Idle,
    message: "",
}

export const getCourses = createAsyncThunk("courses/get", async (courseData = {}, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await courseService.getCourses(courseData.ids ? courseData.ids : [], courseData.keyword ? courseData.keyword : "", token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const createCourse = createAsyncThunk("courses/create", async (courseData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await courseService.createCourse(courseData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const updateCourse = createAsyncThunk("courses/update", async (courseData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await courseService.updateCourse(courseData._id, courseData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteCourse = createAsyncThunk("courses/delete", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await courseService.deleteCourse(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(getCourses.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(getCourses.fulfilled, (state, action) => {
            state.status = Status.Success
            state.courses = action.payload
        })
        .addCase(getCourses.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
        .addCase(createCourse.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(createCourse.fulfilled, (state, action) => {
            state.status = Status.Success
            state.courses.push(action.payload)
        })
        .addCase(createCourse.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })        
        .addCase(updateCourse.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(updateCourse.fulfilled, (state, action) => {
            state.status = Status.Success
            state.courses[state.courses.findIndex((obj => obj._id === action.payload._id))] = action.payload
        })
        .addCase(updateCourse.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
        .addCase(deleteCourse.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(deleteCourse.fulfilled, (state, action) => {
            state.status = Status.Success
            state.courses = state.courses.filter((course) => course._id !== action.payload.id)
        })
        .addCase(deleteCourse.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
    }
})

export const {reset} = courseSlice.actions
export default courseSlice.reducer