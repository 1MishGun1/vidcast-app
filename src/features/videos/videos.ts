import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../api/config";
import { IVideo, IVideoCreate, IVideoState } from "../../models/video";
import { RootState } from "../../store";

export const getAllVideos = createAsyncThunk("videos/getVideos", async () => {
  const { data } = await axios.get("/videos");
  return data;
});

export const getVideoById = createAsyncThunk<IVideo, string>(
  "video/getVideoById",
  async (id) => {
    const { data } = await axios.get(`/videos/${id}`);
    return data;
  }
);

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

export const deleteVideo = createAsyncThunk<string, string>(
  "videos/deleteVideo",
  async (id) => {
    await axios.delete(`/videos/${id}`);
    return id;
  }
);

export const updateVideo = createAsyncThunk<
  IVideo,
  { id: string; videoData: IVideoCreate }
>("videos/updateVideo", async ({ id, videoData }) => {
  const { data } = await axios.patch(`/videos/${id}`, videoData);
  return data;
});

export const getUserVideo = createAsyncThunk<IVideo[], string>(
  "videos/getUserVideo",
  async (userId) => {
    try {
      const { data } = await axios.get(`/videos?userId=${userId}`);
      return data;
    } catch (error: any) {
      return "Error loading user videos";
    }
  }
);

export const getLikedVideo = createAsyncThunk<IVideo[]>(
  "videos/getLikedVideo",
  async () => {
    const { data } = await axios.get("/reactions/liked/me");
    return data;
  }
);

export const getTrendingVideos = createAsyncThunk<IVideo[]>(
  "videos/getTrendingVideos",
  async () => {
    const { data } = await axios.get("/videos/trending");
    return data;
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
  userVideos: {
    data: [],
    loading: false,
    error: null,
  },
  single: {
    data: {},
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

      // Get video by id
      .addCase(getVideoById.pending, (state) => {
        state.single.loading = true;
        state.single.error = null;
      })
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.single.loading = false;
        state.single.data[action.payload._id] = action.payload;
      })
      .addCase(getVideoById.rejected, (state, action) => {
        state.single.loading = false;
        state.single.error = action.error.message || "Ошибка загрузки видео";
      })

      // Create video
      .addCase(createVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createVideo.fulfilled,
        (state, action: PayloadAction<IVideo>) => {
          state.loading = false;
          state.data.unshift(action.payload);
        }
      )
      .addCase(createVideo.rejected, (state) => {
        state.loading = false;
        state.error = "Error create video";
      })

      // Update video
      .addCase(updateVideo.fulfilled, (state, action) => {
        const updatedVideo = action.payload;
        state.data = state.data.map((video) =>
          video._id === updatedVideo._id ? updatedVideo : video
        );
        state.single.data[updatedVideo._id] = updatedVideo;
      })

      // Delete video
      .addCase(
        deleteVideo.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.data = state.data.filter(
            (video) => video._id !== action.payload
          );
          state.userVideos.data = state.userVideos.data.filter(
            (video) => video._id !== action.payload
          );
        }
      )

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
      })

      // Get user videos
      .addCase(getUserVideo.pending, (state) => {
        state.userVideos.loading = true;
        state.userVideos.error = null;
      })
      .addCase(
        getUserVideo.fulfilled,
        (state, action: PayloadAction<IVideo[]>) => {
          state.userVideos.loading = false;
          state.userVideos.data = action.payload;
        }
      )
      .addCase(getUserVideo.rejected, (state, action) => {
        state.userVideos.loading = false;
        state.userVideos.error = action.payload as string;
      })

      // Get liked video by user
      .addCase(getLikedVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getLikedVideo.fulfilled,
        (state, action: PayloadAction<IVideo[]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(getLikedVideo.rejected, (state) => {
        state.loading = false;
        state.error = "Ошибка загрузки лайкнутых видео";
      })

      // Get trending videos
      .addCase(getTrendingVideos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getTrendingVideos.fulfilled,
        (state, action: PayloadAction<IVideo[]>) => {
          state.loading = false;
          state.data = action.payload;
        }
      )
      .addCase(getTrendingVideos.rejected, (state) => {
        state.loading = false;
        state.error = "Ошибка загрузки трендовых видео";
      });
  },
});

export const selectVideoById = (state: RootState, id: string) =>
  state.video.single.data[id];

export const videoReducer = videoSlice.reducer;
