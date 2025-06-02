import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IComment, ICommentCreate, ICommentState } from "../../models/comment";
import axios from "../../api/config";
import { RootState, AppDispatch } from "../../store";

export const getCommentsByVideo = createAsyncThunk(
  "comments/fetchComments",
  async (videoId: string) => {
    try {
      const response = await axios.get(`/comments/${videoId}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async (commentData: ICommentCreate) => {
    try {
      const response = await axios.post("/comments", commentData);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId: string) => {
    try {
      await axios.delete(`/comments/${commentId}`);
      return commentId;
    } catch (error) {
      console.error(error);
    }
  }
);

const initialState: ICommentState = {
  comments: [],
  loading: false,
  error: null,
};

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get comments by video
      .addCase(getCommentsByVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCommentsByVideo.fulfilled,
        (state, action: PayloadAction<IComment[]>) => {
          state.loading = false;
          state.comments = action.payload;
        }
      )
      .addCase(getCommentsByVideo.rejected, (state) => {
        state.loading = false;
        state.error = "Error get comments by video";
      })

      // Create comment
      .addCase(
        createComment.fulfilled,
        (state, action: PayloadAction<IComment>) => {
          const newComment = action.payload;
          if (newComment.parentComment) {
            // ответ на комментарий
            const parent = state.comments.find(
              (c) => c._id === newComment.parentComment
            );
            if (parent) {
              parent.replies.push(newComment);
            }
          } else {
            state.comments.unshift(newComment); // основной комментарий
          }
        }
      )

      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const id = action.payload;
        state.comments = state.comments
          .filter((c) => c._id !== id)
          .map((comment) => ({
            ...comment,
            replies: comment.replies.filter((r) => r._id !== id),
          }));
      });
  },
});

export const selectCommentsByVideoId =
  (videoId: string) =>
  (state: RootState): IComment[] => {
    const comments = state.comment?.comments ?? [];
    return comments.filter(
      (comment) =>
        (typeof comment.video === "string"
          ? comment.video === videoId
          : comment.video._id === videoId) && !comment.parentComment
    );
  };

export const commentReducer = commentSlice.reducer;
