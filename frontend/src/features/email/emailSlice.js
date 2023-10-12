import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import emailService from "./emailService"
import { Status } from "../Status"

const initialState = {
    options: [],
    status: Status.Idle,
    message: "",
}

export const sendEmail = createAsyncThunk("sendemail", async (options, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await emailService.sendEmail(options, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const emailSlice = createSlice({
    name: "email",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(sendEmail.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(sendEmail.fulfilled, (state, action) => {
            state.status = Status.Success
            state.options = action.payload
        })
        .addCase(sendEmail.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
    }
})

export const {reset} = emailSlice.actions
export default emailSlice.reducer