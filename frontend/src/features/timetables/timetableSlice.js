import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import timetableService from "./timetableService"
import { Status } from "../Status"

const initialState = {
    timetables: [],
    status: Status.Idle,
    message: "",
}

export const createTimetable = createAsyncThunk("timetables/create", async (timetableData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await timetableService.createTimetable(timetableData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const updateTimetable = createAsyncThunk("timetables/update", async (timetableData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await timetableService.updateTimetable(timetableData._id, timetableData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getTimetables = createAsyncThunk("timetables/get", async (timetableData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await timetableService.getTimetables(timetableData.ids || [],token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteTimetable = createAsyncThunk("timetables/delete", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await timetableService.deleteTimetable(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const timetableSlice = createSlice({
    name: "timetable",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(createTimetable.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(createTimetable.fulfilled, (state, action) => {
            state.status = Status.Success
            state.timetables.push(action.payload)
        })
        .addCase(createTimetable.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
        .addCase(updateTimetable.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(updateTimetable.fulfilled, (state, action) => {
            state.status = Status.Success
            state.timetables[state.timetables.findIndex((obj => obj._id === action.payload._id))] = action.payload
        })
        .addCase(updateTimetable.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
        .addCase(getTimetables.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(getTimetables.fulfilled, (state, action) => {
            state.status = Status.Success
            state.timetables = action.payload
        })
        .addCase(getTimetables.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
        .addCase(deleteTimetable.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(deleteTimetable.fulfilled, (state, action) => {
            state.status = Status.Success
            state.timetables = state.timetables.filter((timetable) => timetable._id !== action.payload.id)
        })
        .addCase(deleteTimetable.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
    }
})

export const {reset} = timetableSlice.actions
export default timetableSlice.reducer