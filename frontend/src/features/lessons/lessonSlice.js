import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import lessonService from "./lessonService"

const initialState = {
    lessons: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
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

export const updateLesson = createAsyncThunk("lessons/update", async (id, lessonData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await lessonService.updateLesson(id, lessonData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getLessons = createAsyncThunk("lessons/getAll", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await lessonService.getLessons(token)
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
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(createLesson.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createLesson.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.lessons.push(action.payload)
        })
        .addCase(createLesson.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(updateLesson.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateLesson.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.lessons[state.lessons.findIndex((obj => obj._id === action.payload._id))] = action.payload
        })
        .addCase(updateLesson.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(getLessons.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getLessons.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.lessons = action.payload
        })
        .addCase(getLessons.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(deleteLesson.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deleteLesson.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.lessons = state.lessons.filter((lesson) => lesson._id !== action.payload.id)
        })
        .addCase(deleteLesson.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset} = lessonSlice.actions
export default lessonSlice.reducer