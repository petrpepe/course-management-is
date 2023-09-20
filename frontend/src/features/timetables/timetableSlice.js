import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import roleService from "./roleService"

const initialState = {
    roles: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

export const createTimetable = createAsyncThunk("roles/create", async (roleData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await roleService.createTimetable(roleData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const updateTimetable = createAsyncThunk("roles/update", async (roleData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await roleService.updateTimetable(roleData._id, roleData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getTimetables = createAsyncThunk("roles/getAll", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await roleService.getTimetables(token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteTimetable = createAsyncThunk("roles/delete", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await roleService.deleteTimetable(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const roleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(createTimetable.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createTimetable.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.roles.push(action.payload)
        })
        .addCase(createTimetable.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(updateTimetable.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateTimetable.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.roles[state.roles.findIndex((obj => obj._id === action.payload._id))] = action.payload
        })
        .addCase(updateTimetable.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(getTimetables.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getTimetables.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.roles = action.payload
        })
        .addCase(getTimetables.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(deleteTimetable.pending, (state) => {
            state.isLoading = false;
        })
        .addCase(deleteTimetable.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.roles = state.roles.filter((role) => role._id !== action.payload.id)
        })
        .addCase(deleteTimetable.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset} = roleSlice.actions
export default roleSlice.reducer