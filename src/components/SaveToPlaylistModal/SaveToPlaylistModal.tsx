import { FC, useEffect, useState } from "react";
import Styles from "./SaveToPlaylistModal.module.css";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { getPlaylistsByUserId } from "../../features/playlists/playlists";
import axios from "../../api/config";
import { Modal } from "../Modal/Modal";

interface ISaveToPlaylist {
  videoId: string;
  onClose: () => void;
}

export const SaveToPlaylistModal: FC<ISaveToPlaylist> = ({
  videoId,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
  const playlists = useSelector((state: RootState) => state.playlist.playlist);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (userId) {
      dispatch(getPlaylistsByUserId(userId));
    }
  }, [dispatch, userId]);

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    for (const playlistId of selected) {
      try {
        await axios.patch(`/playlist/${playlistId}/add-video`, { videoId });
      } catch (error) {
        console.error("Ошибка при добавлении:", error);
      }
    }
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className={Styles.modalInner}>
        <h3>Сохранить в плейлист</h3>
        <ul className={Styles.playlist_list}>
          {playlists.map((pl) => (
            <li key={pl._id} className={Styles.playlist_item}>
              <label>
                <input
                  type="checkbox"
                  checked={selected.includes(pl._id)}
                  onChange={() => toggleSelection(pl._id)}
                />
                {pl.title}
              </label>
            </li>
          ))}
        </ul>
        <div className={Styles.actions}>
          <button onClick={handleSave} className={Styles["btn_save"]}>
            Сохранить
          </button>
          <button onClick={onClose} className={Styles["btn_save"]}>
            Отмена
          </button>
        </div>
      </div>
    </Modal>
  );
};
