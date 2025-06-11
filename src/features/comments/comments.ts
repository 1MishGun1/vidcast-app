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

export const deleteComment = createAsyncThunk<
  string,
  { commentId: string; userId: string }
>("comments/deleteComment", async ({ commentId, userId }) => {
  await axios.delete(`/comments/${commentId}`, {
    params: { userId },
  });
  return commentId;
});
function findCommentById(comments: IComment[], id: string): IComment | null {
  for (const comment of comments) {
    if (comment._id === id) return comment;
    const foundInReplies = findCommentById(comment.replies, id);
    if (foundInReplies) return foundInReplies;
  }
  return null;
}

function deleteCommentRecursive(comments: IComment[], id: string): IComment[] {
  return comments
    .filter((c) => c._id !== id)
    .map((comment) => ({
      ...comment,
      replies: deleteCommentRecursive(comment.replies, id),
    }));
}

function sortComments(comments: IComment[]): IComment[] {
  return comments
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .map((comment) => ({
      ...comment,
      replies: sortComments(comment.replies || []),
    }));
}

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
            const parent = findCommentById(
              state.comments,
              newComment.parentComment
            );
            if (parent) {
              parent.replies.push(newComment);
            }
          } else {
            state.comments.unshift(newComment);
          }
        }
      )

      // Delete comment
      .addCase(
        deleteComment.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.comments = deleteCommentRecursive(
            state.comments,
            action.payload
          );
        }
      );
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
