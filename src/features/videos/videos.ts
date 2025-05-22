import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchVideo } from "../../api/config";
import { IVideo, IVideoState } from "../../models/video";

export const getAllVideos = createAsyncThunk("videos/getVideos", async () => {
  const data = await fetchVideo();
  return data;
});

const initialState: IVideoState = {
  data: [],
  loading: false,
  error: null,
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllVideos.fulfilled,
        (state, action: PayloadAction<IVideo[]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(getAllVideos.rejected, (state) => {
        state.loading = false;
        state.error = "Error loading videos";
      });
  },
});

export const videoReducer = videoSlice.reducer;
