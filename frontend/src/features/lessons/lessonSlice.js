import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import lessonService from "./lessonService"
import { Status } from "../Status"

const initialState = {
    lessons: [],
    status: Status.Idle,
    message: "",
}

export const createLesson = createAsyncThunk("lessons/create", async (lessonData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await lessonService.createLesson(lessonData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const updateLesson = createAsyncThunk("lessons/update", async (lessonData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await lessonService.updateLesson(lessonData._id, lessonData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getLessons = createAsyncThunk("lessons/get", async (lessonData = {}, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await lessonService.getLessons(lessonData.ids || [], lessonData.detail || false, lessonData.keyword, lessonData.courseId, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteLesson = createAsyncThunk("lessons/delete", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await lessonService.deleteLesson(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const lessonSlice = createSlice({
    name: "lesson",
    initialState,
    reducers: {
        hardReset: (state) => {return {...initialState, lessons: state.lessons}},
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
        .addCase(createLesson.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(createLesson.fulfilled, (state, action) => {
            state.status = Status.Success
            state.lessons.push(action.payload)
        })
        .addCase(createLesson.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
        .addCase(updateLesson.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(updateLesson.fulfilled, (state, action) => {
            state.status = Status.Success
            state.lessons[state.lessons.findIndex(obj => obj._id === action.payload._id)] = action.payload
        })
        .addCase(updateLesson.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
        .addCase(getLessons.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(getLessons.fulfilled, (state, action) => {
            state.status = Status.Success
            action.payload.map(l => {
                if (state.lessons.map(sl => sl._id).includes(l._id)) state.lessons[state.lessons.findIndex(obj => obj._id === l._id)] = {...l}
                else {state.lessons.push(l)}
                return null
            })
        })
        .addCase(getLessons.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
        .addCase(deleteLesson.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(deleteLesson.fulfilled, (state, action) => {
            state.status = Status.Success
            state.lessons = state.lessons.filter((lesson) => lesson._id !== action.payload.id)
        })
        .addCase(deleteLesson.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
    }
})

export const {reset} = lessonSlice.actions
export default lessonSlice.reducer