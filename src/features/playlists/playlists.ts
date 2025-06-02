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

      .addCase(getPlaylistsByUserId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.playlist = action.payload;
      });
  },
});

export const playlistReducer = playlistsSlice.reducer;
export const selectPlaylistStatus = (state: RootState) => state.playlist.status;
