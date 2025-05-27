import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../api/config";
import { IVideo, IVideoCreate, IVideoState } from "../../models/video";

export const getAllVideos = createAsyncThunk("videos/getVideos", async () => {
  const { data } = await axios.get("/videos");
  return data;
});

export const getVideoTags = createAsyncThunk(
  "videos/getVideoTags",
  async () => {
    const { data } = await axios.get("/tags");
    return data;
  }
);

export const createVideo = createAsyncThunk<IVideo, IVideoCreate>(
  "videos/createVideo",
  async (params) => {
    try {
      const { data } = await axios.post("/videos", params);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

const initialState: IVideoState = {
  data: [],
  loading: false,
  error: null,
  tags: {
    data: [],
    loading: false,
    error: null,
  },
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all videos
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
        state.tags.loading = false;
        state.tags.error = "Error loading videos";
      })

      // Create video
      .addCase(createVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createVideo.fulfilled,
        (state, action: PayloadAction<IVideo>) => {
          state.loading = true;
          state.data.unshift(action.payload);
        }
      )
      .addCase(createVideo.rejected, (state) => {
        state.loading = true;
        state.error = "Error create video";
      })

      // Get tags
      .addCase(getVideoTags.pending, (state) => {
        state.tags.loading = true;
        state.tags.error = null;
      })
      .addCase(
        getVideoTags.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.tags.loading = false;
          state.tags.data = action.payload;
        }
      )
      .addCase(getVideoTags.rejected, (state) => {
        state.tags.loading = false;
        state.tags.error = "Error loading videos";
      });
  },
});

export const videoReducer = videoSlice.reducer;
