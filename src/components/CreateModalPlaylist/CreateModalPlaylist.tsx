import { useState } from "react";
import { Modal } from "../Modal/Modal";
import Styles from "./CreateModalPlaylist.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  createPlaylist,
  updatePlaylist,
} from "../../features/playlists/playlists";
import { IPlaylist } from "../../models/playlist";

type PropsModal = {
  onClose: () => void;
  initialData?: IPlaylist;
};

export const CreateModalPlaylist = ({ onClose, initialData }: PropsModal) => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [isVisible, setIsVisible] = useState(initialData?.isVisible ?? true);
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  const handleSubmit = () => {
    if (!title.trim()) return;

    if (initialData) {
      dispatch(
        updatePlaylist({
          id: initialData._id,
          data: { title, description, isVisible },
        })
      );
    } else {
      dispatch(createPlaylist({ title, description, isVisible }));
    }

    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className={Styles.modalInner}>
        <h3>Создание плейлиста</h3>
        <input
          className={Styles["modal_input"]}
          type="text"
          placeholder="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          data-theme={theme}
        />
        <textarea
          className={Styles["modal_input"]}
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          data-theme={theme}
        />
        <label>
          <input
            type="checkbox"
            checked={isVisible}
            onChange={() => setIsVisible(!isVisible)}
            className={Styles["modal_checkbox"]}
          />
          Сделать публичным
        </label>
        <div className={Styles.actions}>
          <button
            className={Styles["modal_btn"]}
            onClick={handleSubmit}
            data-theme={theme}
          >
            Создать
          </button>
          <button
            className={Styles["modal_btn"]}
            onClick={onClose}
            data-theme={theme}
          >
            Отмена
          </button>
        </div>
      </div>
    </Modal>
  );
};
