import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  IUser,
  IUserState,
  ILoginUser,
  IUserResponse,
} from "../../models/user";
import axios from "../../api/config";
import { RootState } from "../../store";

export const fetchUserData = createAsyncThunk<IUser, ILoginUser>(
  "auth/fetchUserData",
  async (params) => {
    const { data } = await axios.post("/login", params);
    return data;
  }
);

export const fetchAuthMe = createAsyncThunk<IUser>(
  "auth/fetchAuthMe",
  async () => {
    const { data } = await axios.get("/me");
    return data;
  }
);

const initialState: IUserState = {
  data: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserData.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchUserData.rejected, (state) => {
        state.loading = false;
        state.error = "Error login user";
      })

      .addCase(fetchAuthMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthMe.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAuthMe.rejected, (state) => {
        state.loading = false;
        state.error = "Error login user";
      });
  },
});

export const selectIsAuth = (state: RootState) => Boolean(state.auth.data);

export const { logout } = authSlice.actions;

export const authReducer = authSlice.reducer;
