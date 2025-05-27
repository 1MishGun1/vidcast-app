export interface IVideo {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  views: number;
  user: {
    _id: string;
    login: string;
    name?: string;
    surname?: string;
    avatar?: string;
  };
  cover: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface IVideoCreate {
  title: string;
  description: string;
  tags: string[];
  cover: string;
  videoUrl: string;
}

export interface IVideoState {
  data: IVideo[];
  loading: boolean;
  error: string | null;
  tags: {
    data: string[];
    loading: boolean;
    error: string | null;
  };
}
