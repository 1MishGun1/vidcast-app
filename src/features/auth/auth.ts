import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  IUser,
  IUserState,
  ILoginUser,
  IRegisterUser,
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

export const fetchUserRegister = createAsyncThunk<IUser, IRegisterUser>(
  "auth/fetchUserRegister",
  async (params) => {
    const { data } = await axios.post("/register", params);
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

export const getUserById = createAsyncThunk<IUser, string>(
  "auth/getUserById",
  async (userId) => {
    const { data } = await axios.get(`/users/${userId}`);
    return data;
  }
);

const initialState: IUserState = {
  currentUser: null,
  selectedUser: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Authorization user
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserData.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.loading = false;
          state.currentUser = action.payload;
        }
      )
      .addCase(fetchUserData.rejected, (state) => {
        state.loading = false;
        state.error = "Error login user";
      })
      // Get auth user
      .addCase(fetchAuthMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthMe.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchAuthMe.rejected, (state) => {
        state.loading = false;
        state.error = "Error login user";
      })
      // Register user
      .addCase(fetchUserRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserRegister.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.loading = false;
          state.currentUser = action.payload;
        }
      )
      .addCase(fetchUserRegister.rejected, (state) => {
        state.loading = false;
        state.error = "Error login user";
      })
      // Get all users
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.selectedUser = null;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state) => {
        state.loading = false;
        state.error = "Error getting user";
      });
  },
});

export const selectIsAuth = (state: RootState) =>
  Boolean(state.auth.currentUser);
export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const electSelectedUser = (state: RootState) => state.auth.selectedUser;
// export const selectAllUsers = (state: RootState) => state.auth.users;

export const { logout } = authSlice.actions;

export const authReducer = authSlice.reducer;
