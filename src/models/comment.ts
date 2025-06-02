import { IUser } from "./user";

export interface IComment {
  _id: string;
  text: string;
  video: string | { _id: string };
  user: IUser;
  replies: IComment[];
  parentComment?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICommentCreate {
  text: string;
  videoId: string;
  parentCommentId?: string | null;
}

export interface ICommentState {
  comments: IComment[];
  loading: boolean;
  error: string | null;
}
