import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import classService from "./classService"
import { Status } from "../Status"

const initialState = {
    classes: [],
    status: Status.Idle,
    message: "",
}

export const createClass = createAsyncThunk("classes/create", async (classData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await classService.createClass(classData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const updateClass = createAsyncThunk("classes/update", async (classData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await classService.updateClass(classData._id, classData, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const getClasses = createAsyncThunk("classes/get", async (classData = {}, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await classService.getClasses(classData.ids ? classData.ids : [], classData.keyword ? classData.keyword : "", token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const deleteClass = createAsyncThunk("classes/delete", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await classService.deleteClass(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && 
            error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const classSlice = createSlice({
    name: "class",
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(createClass.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(createClass.fulfilled, (state, action) => {
            state.status = Status.Success
            state.classes.push(action.payload)
        })
        .addCase(createClass.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
        .addCase(updateClass.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(updateClass.fulfilled, (state, action) => {
            state.status = Status.Success
            state.classes[state.classes.findIndex((obj => obj._id === action.payload._id))] = action.payload
        })
        .addCase(updateClass.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
        .addCase(getClasses.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(getClasses.fulfilled, (state, action) => {
            state.status = Status.Success
            state.classes = action.payload
        })
        .addCase(getClasses.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
        .addCase(deleteClass.pending, (state) => {
            state.status = Status.Loading
        })
        .addCase(deleteClass.fulfilled, (state, action) => {
            state.status = Status.Success
            state.classes = state.classes.filter((classVar) => classVar._id !== action.payload.id)
        })
        .addCase(deleteClass.rejected, (state, action) => {
            state.status = Status.Error
            state.message = action.payload
        })
    }
})

export const {reset} = classSlice.actions
export default classSlice.reducer