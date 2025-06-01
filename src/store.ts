import { configureStore } from "@reduxjs/toolkit";
import { videoReducer } from "./features/videos/videos";
import { themeReducer } from "./features/theme/theme";
import { authReducer } from "./features/auth/auth";
import { playlistReducer } from "./features/playlists/playlists";
import { reactionReducer } from "./features/reactions/reactions";

export const store = configureStore({
  reducer: {
    video: videoReducer,
    theme: themeReducer,
    auth: authReducer,
    playlist: playlistReducer,
    reaction: reactionReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
