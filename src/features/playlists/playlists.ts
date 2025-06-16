import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  IPlaylist,
  IPlaylistCreate,
  IPlaylistState,
} from "../../models/playlist";
import axios from "../../api/config";
import { RootState } from "../../store";

export const createPlaylist = createAsyncThunk<IPlaylist, IPlaylistCreate>(
  "playlist/createPlaylist",
  async (params) => {
    try {
      const { data } = await axios.post("/playlist", params);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const getPlaylistsByUserId = createAsyncThunk<IPlaylist[], string>(
  "playlists/getPlaylistsByUserId",
  async (userId) => {
    const { data } = await axios.get(`/playlist/user/${userId}`);
    return data;
  }
);

export const updatePlaylist = createAsyncThunk<
  IPlaylist,
  { id: string; data: IPlaylistCreate }
>("playlist/updatePlaylist", async ({ id, data }) => {
  const response = await axios.patch(`/playlist/${id}`, data);
  return response.data;
});

export const deletePlaylist = createAsyncThunk<string, string>(
  "playlist/deletePlaylist",
  async (id) => {
    await axios.delete(`/playlist/${id}`);
    return id;
  }
);

const initialState: IPlaylistState = {
  playlist: [],
  status: "idle",
  error: null,
};

export const playlistsSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPlaylist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createPlaylist.fulfilled,
        (state, action: PayloadAction<IPlaylist>) => {
          state.status = "succeeded";
          state.playlist.push(action.payload);
        }
      )
      .addCase(createPlaylist.rejected, (state) => {
        state.status = "failed";
        state.error = "Error create playlist";
      })

      .addCase(updatePlaylist.fulfilled, (state, action) => {
        const index = state.playlist.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.playlist[index] = action.payload;
        }
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.playlist = state.playlist.filter((p) => p._id !== action.payload);
      })

      .addCase(getPlaylistsByUserId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.playlist = action.payload;
      });
  },
});

export const playlistReducer = playlistsSlice.reducer;
export const selectPlaylistStatus = (state: RootState) => state.playlist.status;
