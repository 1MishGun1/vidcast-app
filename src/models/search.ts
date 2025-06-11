export interface IVideoSearchResult {
  _id: string;
  title: string;
  cover: string;
  hlsUrl: string;
  views: number;
  createdAt: string;
  user: {
    _id: string;
    login: string;
    avatar: string;
  };
}


export interface ISearchState {
  results: IVideoSearchResult[];
  loading: boolean;
  error: string | null;
}
