import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/config";

export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async () => {
    const { data } = await axios.get("/history");
    return data;
  }
);

export const updateHistory = createAsyncThunk(
  "history/updateHistory",
  async (videoId: string) => {
    const { data } = await axios.post("/history", { videoId });
    return data;
  }
);

const initialState = {
  items: [],
  status: "idle",
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchHistory.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const historyReducer = historySlice.reducer;
