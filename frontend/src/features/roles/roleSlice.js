import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import roleService from "./roleService"

const initialState = {
    roles: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

export const createRole = createAsyncThunk("roles/create", async (roleData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await roleService.createRole(roleData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const updateRole = createAsyncThunk("roles/update", async (roleData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await roleService.updateRole(roleData._id, roleData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getRoles = createAsyncThunk("roles/getAll", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await roleService.getRoles(token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteRole = createAsyncThunk("roles/delete", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await roleService.deleteRole(id, token)
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
        .addCase(createRole.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createRole.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.roles.push(action.payload)
        })
        .addCase(createRole.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(updateRole.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateRole.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.roles[state.roles.findIndex((obj => obj._id === action.payload._id))] = action.payload
        })
        .addCase(updateRole.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(getRoles.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getRoles.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.roles = action.payload
        })
        .addCase(getRoles.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(deleteRole.pending, (state) => {
            state.isLoading = false;
        })
        .addCase(deleteRole.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.roles = state.roles.filter((role) => role._id !== action.payload.id)
        })
        .addCase(deleteRole.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset} = roleSlice.actions
export default roleSlice.reducer