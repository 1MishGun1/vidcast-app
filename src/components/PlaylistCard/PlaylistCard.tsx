import { FC, useEffect, useState } from "react";
import { IPlaylist } from "../../models/playlist";
import { Link } from "react-router-dom";
import Styles from "./PlaylistCard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { getVideoById, selectVideoById } from "../../features/videos/videos";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { deletePlaylist } from "../../features/playlists/playlists";
import { selectCurrentUser } from "../../features/auth/auth";

interface IPlaylistProps {
  playlist: IPlaylist;
  onEdit?: (playlist: IPlaylist) => void;
}

export const PlaylistCard: FC<IPlaylistProps> = ({ playlist, onEdit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const video = useSelector((state: RootState) =>
    selectVideoById(state, playlist.videos[playlist.videos.length - 1])
  );
  const [hovered, setHovered] = useState(false);
  const currentUserId = useSelector(
    (state: RootState) => state.auth.currentUser?._id
  );

  const isAuthor =
    typeof playlist.user === "string"
      ? playlist.user === currentUserId
      : playlist.user._id === currentUserId;

  useEffect(() => {
    if (!video && playlist.videos.length > 0) {
      dispatch(getVideoById(playlist.videos[playlist.videos.length - 1]));
    }
  }, [playlist.videos, dispatch, video]);

  const handleDelete = () => {
    if (window.confirm("Удалить плейлист?")) {
      dispatch(deletePlaylist(playlist._id));
    }
  };

  return (
    <div
      className={Styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/playlist/${playlist._id}`} className={Styles.link}>
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

      {hovered && isAuthor && (
        <div className={Styles.actions}>
          <button
            className={Styles["playlist__edit_button"]}
            onClick={(e) => {
              e.preventDefault();
              onEdit?.(playlist);
            }}
          >
            <MdModeEdit />
          </button>
          <button
            className={Styles["playlist__delete_button"]}
            onClick={handleDelete}
          >
            <MdDelete />
          </button>
        </div>
      )}
    </div>
  );
};
