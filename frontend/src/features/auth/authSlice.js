import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import authService from './authService';
import { Status } from '../Status';

const user = JSON.parse(localStorage.getItem("user"))

const initialState = {
    user: user ? user : null,
    status: Status.Idle,
    message: "",
}

// Register user
export const register = createAsyncThunk("auth/register", async (user, thunkAPI) => {
    try {
        return await authService.register(user)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
    try {
        return await authService.login(user)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const logout = createAsyncThunk("auth/logout", async () => {
    await authService.logout()
})

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (user, thunkAPI) => {
    try {
        return await authService.forgotPassword(user)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const setNewPassword = createAsyncThunk("auth/setNewPassword", async (user, thunkAPI) => {
    try {
        return await authService.setNewPassword(user)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const updateAuth = createAsyncThunk("auth/update", async (user, thunkAPI) => {
    try {
        let item = JSON.parse(localStorage.getItem("user"))
        for (const key in user) {
            if (Object.hasOwnProperty.call(user, key)) {
                item[key] = user[key];
            }
        }
        localStorage.setItem("user", JSON.stringify(item))
        return item
    } catch (error) {
        return thunkAPI.rejectWithValue(error)
    }
})

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false
            state.isSuccess = false
            state.isLoading = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(register.fulfilled, (state, action) => {
            state.status = Status.Success
            state.user = action.payload
        })
        .addCase(register.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
            state.user = null
        })
        .addCase(login.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(login.fulfilled, (state, action) => {
            state.status = Status.Success
            state.user = action.payload
        })
        .addCase(login.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
            state.user = null
        })
        .addCase(updateAuth.fulfilled, (state, action) => {
            state.user = action.payload
        })
        .addCase(logout.fulfilled, (state) => {
            state.user = null
            state.courses = null
        })
        .addCase(forgotPassword.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(forgotPassword.fulfilled, (state, action) => {
            state.status = Status.Success
        })
        .addCase(forgotPassword.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
            state.user = null
        })
        .addCase(setNewPassword.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(setNewPassword.fulfilled, (state, action) => {
            state.status = Status.Success
            state.user = action.payload
        })
        .addCase(setNewPassword.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
            state.user = null
        })
    },
})

export const {reset} = authSlice.actions
export default authSlice.reducer