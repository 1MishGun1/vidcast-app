export interface IPlaylist {
  _id: string;
  title: string;
  description: string;
  isVisible: boolean;
  user: string;
  videos: string[];
  createdAt: string;
}

export interface IPlaylistCreate {
  title: string;
  description: string;
  isVisible: boolean;
}

export interface IPlaylistState {
  playlist: IPlaylist[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
