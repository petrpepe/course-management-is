import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import enrollmentService from "./enrollmentService";
import { Status } from "../Status";

const initialState = {
  enrollments: [],
  status: Status.Idle,
  message: "",
};

export const createEnrollment = createAsyncThunk(
  "enrollments/create",
  async (enrollmentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await enrollmentService.createEnrollment(enrollmentData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const updateEnrollment = createAsyncThunk(
  "enrollments/update",
  async (enrollmentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await enrollmentService.updateEnrollment(
        enrollmentData.classId,
        enrollmentData,
        token,
      );
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getEnrollments = createAsyncThunk(
  "enrollments/get",
  async (enrollmentData = {}, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await enrollmentService.getEnrollments(
        enrollmentData.ids || [],
        token,
      );
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const deleteEnrollment = createAsyncThunk(
  "enrollments/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await enrollmentService.deleteEnrollment(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEnrollment.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(createEnrollment.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.enrollments.push(action.payload);
      })
      .addCase(createEnrollment.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      })
      .addCase(updateEnrollment.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(updateEnrollment.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.enrollments[
          state.enrollments.findIndex((obj) => obj._id === action.payload._id)
        ] = action.payload;
      })
      .addCase(updateEnrollment.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      })
      .addCase(getEnrollments.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(getEnrollments.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.enrollments = action.payload;
      })
      .addCase(getEnrollments.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      })
      .addCase(deleteEnrollment.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(deleteEnrollment.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.enrollments = state.enrollments.filter(
          (enrollment) => enrollment._id !== action.payload.id,
        );
      })
      .addCase(deleteEnrollment.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      });
  },
});

export const { reset } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
