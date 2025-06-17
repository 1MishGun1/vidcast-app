import { IVideo } from "./video";

export interface IHistoryItem {
  _id: string;
  video: IVideo;
  viewedAt: string;
}
