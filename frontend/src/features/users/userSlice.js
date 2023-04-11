import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import userService from "./userService"

const initialState = {
    users: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

export const createUser = createAsyncThunk("users/create", async (userData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await userService.createUser(userData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const updateUser = createAsyncThunk("users/update", async (userData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await userService.updateUser(userData._id, userData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getUsers = createAsyncThunk("users/getAll", async (data = {}, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await userService.getUsers(data.ids ? data.ids : [], data.detail, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteUser = createAsyncThunk("users/delete", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await userService.deleteUser(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(createUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.users.push(action.payload)
        })
        .addCase(createUser.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(updateUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.users[state.users.findIndex((obj => obj._id === action.payload._id))] = action.payload
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(getUsers.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getUsers.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.users = action.payload
        })
        .addCase(getUsers.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(deleteUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.users = state.users.filter((user) => user._id !== action.payload.id)
        })
        .addCase(deleteUser.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset} = userSlice.actions
export default userSlice.reducer