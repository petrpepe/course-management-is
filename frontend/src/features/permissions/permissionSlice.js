import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import permissionService from "./permissionService";
import { Status } from "../Status";

const initialState = {
  permissions: [],
  status: Status.Idle,
  message: "",
};

export const createPermission = createAsyncThunk(
  "permissions/create",
  async (permissionData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await permissionService.createPermission(permissionData, token);
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

export const updatePermission = createAsyncThunk(
  "permissions/update",
  async (id, permissionData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await permissionService.updatePermission(
        id,
        permissionData,
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

export const getPermissions = createAsyncThunk(
  "permissions/get",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await permissionService.getPermissions(token);
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

export const deletePermission = createAsyncThunk(
  "permissions/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await permissionService.deletePermission(id, token);
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

export const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPermission.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.permissions.push(action.payload);
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      })
      .addCase(updatePermission.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.permissions[
          state.permissions.findIndex((obj) => obj._id === action.payload._id)
        ] = action.payload;
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      })
      .addCase(getPermissions.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(getPermissions.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.permissions = action.payload;
      })
      .addCase(getPermissions.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      })
      .addCase(deletePermission.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.permissions = state.permissions.filter(
          (permission) => permission._id !== action.payload.id,
        );
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      });
  },
});

export const { reset } = permissionSlice.actions;
export default permissionSlice.reducer;
