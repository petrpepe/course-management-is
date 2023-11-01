import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import providerService from "./providerService";
import { Status } from "../Status";

const initialState = {
  providers: [],
  status: Status.Idle,
  message: "",
};

export const createProvider = createAsyncThunk(
  "providers/create",
  async (providerData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await providerService.createProvider(providerData, token);
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

export const updateProvider = createAsyncThunk(
  "providers/update",
  async (providerData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await providerService.updateProvider(
        providerData._id,
        providerData,
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

export const getProviders = createAsyncThunk(
  "providers/get",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await providerService.getProviders(token);
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

export const deleteProvider = createAsyncThunk(
  "providers/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await providerService.deleteProvider(id, token);
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

export const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProvider.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(createProvider.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.providers.push(action.payload);
      })
      .addCase(createProvider.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      })
      .addCase(updateProvider.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(updateProvider.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.providers[
          state.providers.findIndex((obj) => obj._id === action.payload._id)
        ] = action.payload;
      })
      .addCase(updateProvider.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      })
      .addCase(getProviders.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(getProviders.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.providers = action.payload;
      })
      .addCase(getProviders.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      })
      .addCase(deleteProvider.pending, (state) => {
        state.status = Status.Loading;
      })
      .addCase(deleteProvider.fulfilled, (state, action) => {
        state.status = Status.Success;
        state.providers = state.providers.filter(
          (provider) => provider._id !== action.payload.id,
        );
      })
      .addCase(deleteProvider.rejected, (state, action) => {
        state.status = Status.Error;
        state.message = action.payload;
      });
  },
});

export const { reset } = providerSlice.actions;
export default providerSlice.reducer;
