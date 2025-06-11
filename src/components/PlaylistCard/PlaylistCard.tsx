import { FC, useEffect } from "react";
import { IPlaylist } from "../../models/playlist";
import { Link } from "react-router-dom";
import Styles from "./PlaylistCard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { getVideoById, selectVideoById } from "../../features/videos/videos";

interface IPlaylistProps {
  playlist: IPlaylist;
}

export const PlaylistCard: FC<IPlaylistProps> = ({ playlist }) => {
  const dispatch = useDispatch<AppDispatch>();
  const video = useSelector((state: RootState) =>
    selectVideoById(state, playlist.videos[playlist.videos.length - 1])
  );

  useEffect(() => {
    if (!video && playlist.videos.length > 0) {
      dispatch(getVideoById(playlist.videos[playlist.videos.length - 1]));
    }
  }, [playlist.videos, dispatch, video]);

  return (
    <Link to={`/playlist/${playlist._id}`} className={Styles.card}>
      <div className={Styles.thumbnail}>
        {video?.cover ? (
          <img
            src={`http://localhost:3333${video.cover}`}
            alt={video.title}
            className={Styles.thumbnail_img}
          />
        ) : (
          ""
        )}
        <div className={Styles.thumbnail_overlay}>
          {playlist.videos.length} видео
        </div>
      </div>
      <div className={Styles.info}>
        <h3 className={Styles.title}>{playlist.title}</h3>
        <p className={Styles.description}>{playlist.description}</p>
      </div>
    </Link>
  );
};
