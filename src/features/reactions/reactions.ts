import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../api/config";
import { IReactionState } from "../../models/reaction";

const initialState: IReactionState = {
  likes: 0,
  dislikes: 0,
  userReaction: null,
  loading: false,
  error: null,
};

export const getFetchReactions = createAsyncThunk(
  "reaction/getFetchReactions",
  async (videoId: string) => {
    const { data } = await axios.get(`/reactions/${videoId}`);
    return data;
  }
);

export const toggleReaction = createAsyncThunk(
  "reaction/toggleReaction",
  async ({ videoId, type }: { videoId: string; type: "like" | "dislike" }) => {
    const { data } = await axios.post(`/reactions`, { videoId, type });
    return { type };
  }
);

export const reactionSlice = createSlice({
  name: "reaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFetchReactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFetchReactions.fulfilled, (state, action) => {
        state.likes = action.payload.likes;
        state.dislikes = action.payload.dislikes;
        state.userReaction = action.payload.userReaction;
        state.loading = false;
      })
      .addCase(toggleReaction.fulfilled, (state, action) => {
        const newType = action.payload.type;

        if (state.userReaction === "like") state.likes--;
        if (state.userReaction === "dislike") state.dislikes--;

        if (state.userReaction === newType) {
          state.userReaction = null;
        } else {
          state.userReaction = newType;
          if (newType === "like") state.likes++;
          else state.dislikes++;
        }
      });
  },
});

export const reactionReducer = reactionSlice.reducer;
