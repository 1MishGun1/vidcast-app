export interface IReactionState {
  likes: number;
  dislikes: number;
  userReaction: "like" | "dislike" | null;
  loading: boolean;
  error: string | null;
}
