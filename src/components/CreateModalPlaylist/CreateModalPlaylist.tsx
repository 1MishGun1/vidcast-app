import { useState } from "react";
import { Modal } from "../Modal/Modal";
import Styles from "./CreateModalPlaylist.module.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { createPlaylist } from "../../features/playlists/playlists";

type PropsModal = {
  onClose: () => void;
};

export const CreateModalPlaylist = ({ onClose }: PropsModal) => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = () => {
    if (!title.trim()) return;

    dispatch(createPlaylist({ title, description, isVisible }));
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
        />
        <textarea
          className={Styles["modal_input"]}
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={isVisible}
            onChange={() => setIsVisible(!isVisible)}
          />
          Сделать публичным
        </label>
        <div className={Styles.actions}>
          <button className={Styles["modal_btn"]} onClick={handleSubmit}>
            Создать
          </button>
          <button className={Styles["modal_btn"]} onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </Modal>
  );
};
