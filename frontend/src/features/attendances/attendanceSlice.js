import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import attendanceService from "./attendanceService"

const initialState = {
    attendances: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

export const createAttendance = createAsyncThunk("attendances/create", async (attendanceData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await attendanceService.createAttendance(attendanceData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getAttendances = createAsyncThunk("attendances/getAll", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await attendanceService.getAttendances(token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteAttendance = createAsyncThunk("attendances/delete", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await attendanceService.deleteAttendance(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const attendanceSlice = createSlice({
    name: "attendance",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(createAttendance.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createAttendance.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.attendances.push(action.payload)
        })
        .addCase(createAttendance.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(getAttendances.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getAttendances.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.attendances = action.payload
        })
        .addCase(getAttendances.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(deleteAttendance.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deleteAttendance.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.attendances = state.attendances.filter((attendance) => attendance._id !== action.payload.id)
        })
        .addCase(deleteAttendance.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset} = attendanceSlice.actions
export default attendanceSlice.reducer