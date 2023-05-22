import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import authService from './authService';

const user = JSON.parse(localStorage.getItem("user"))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
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
            state.isLoading = true
        })
        .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })
        .addCase(register.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(login.pending, (state) => {
            state.isLoading = true
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
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
            state.isLoading = true
        })
        .addCase(forgotPassword.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
        })
        .addCase(forgotPassword.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(setNewPassword.pending, (state) => {
            state.isLoading = true
        })
        .addCase(setNewPassword.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })
        .addCase(setNewPassword.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
    },
})

export const {reset} = authSlice.actions
export default authSlice.reducer