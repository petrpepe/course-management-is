import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import courseService from "./courseService"

const initialState = {
    courses: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

export const getCourses = createAsyncThunk("courses/getAll", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await courseService.getCourses(token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getCourseById = createAsyncThunk("courses/getOne", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await courseService.getCourseById(id, token)
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

export const updateCourse = createAsyncThunk("courses/update", async (id, courseData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await courseService.updateCourse(id, courseData, token)
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
            state.isLoading = true;
        })
        .addCase(getCourses.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.courses = action.payload
        })
        .addCase(getCourses.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(getCourseById.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getCourseById.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.courses[0] = action.payload
        })
        .addCase(getCourseById.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(createCourse.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createCourse.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.courses.push(action.payload)
        })
        .addCase(createCourse.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action
        })        
        .addCase(updateCourse.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateCourse.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.courses[state.courses.findIndex((obj => obj._id === action.payload._id))] = action.payload
        })
        .addCase(updateCourse.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(deleteCourse.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deleteCourse.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.courses = state.courses.filter((course) => course._id !== action.payload.id)
        })
        .addCase(deleteCourse.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset} = courseSlice.actions
export default courseSlice.reducer