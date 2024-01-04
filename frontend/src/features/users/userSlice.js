import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";
import { Status } from "../Status";

const initialState = {
  users: [],
  status: Status.Idle,
  message: "",
};

export const createUser = createAsyncThunk(
  "users/create",
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await userService.createUser(userData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await userService.updateUser(userData._id, userData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUsers = createAsyncThunk(
  "users/get",
  async (userData = {}, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await userService.getUsers(
        userData.ids ? userData.ids : [],
        userData.keyword,
        token
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
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      if (userId !== id) return await userService.deleteUser(id, token);
      else throw new Error("You can't delete yourself!");
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.users[
          state.users.findIndex((obj) => obj._id === action.payload._id)
        ] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      })
      .addCase(getUsers.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = Status.Success;
        action.payload.map((u) => {
          if (state.users.map((su) => su._id).includes(u._id))
            state.users[state.users.findIndex((obj) => obj._id === u._id)] = u;
          else {
            state.users.push(u);
          }
          return null;
        });
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.users = state.users.filter(
          (user) => user._id !== action.payload.id
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
