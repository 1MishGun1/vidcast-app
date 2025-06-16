import { useSelector, useDispatch } from "react-redux";
import { Modal } from "../Modal/Modal";
import Styles from "./UserEditModal.module.css";
import { updateUser } from "../../features/auth/auth";
import { AppDispatch, RootState } from "../../store";
import { useState } from "react";
import axios from "../../api/config";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export const UserEditModal = ({ open, onClose }: IProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    surname: user?.surname || "",
    login: user?.login || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    oldPassword: "",
    newPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangeFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const { data } = await axios.post(
        "http://localhost:3333/uploads/avatars",
        formData
      );

      setFormData((prev) => ({
        ...prev,
        avatar: data.url,
      }));
    } catch (error) {
      console.error("Ошибка при загрузке аватарки:", error);
    }
  };

  const handlePasswordCheck = () => {
    setShowNewPassword(!!formData.oldPassword);
  };

  const handleSubmit = () => {
    dispatch(updateUser(formData)).then(() => {
      onClose();
    });
  };

  return (
    <Modal onClose={onClose}>
      <div className={Styles["edit_user_modal"]} data-theme={theme}>
        <h2 className={Styles["edit_user_title"]} data-theme={theme}>
          Редактировать профиль
        </h2>
        <div className={Styles["edit_user_inputs"]}>
          <input
            className={Styles["edit_user_input"]}
            type="text"
            name="name"
            placeholder="Имя"
            value={formData.name}
            onChange={handleChange}
            data-theme={theme}
          />
          <input
            className={Styles["edit_user_input"]}
            type="text"
            name="surname"
            placeholder="Фамилия"
            value={formData.surname}
            onChange={handleChange}
            data-theme={theme}
          />
          <input
            className={Styles["edit_user_input"]}
            type="text"
            name="login"
            placeholder="Логин"
            value={formData.login}
            onChange={handleChange}
            data-theme={theme}
          />
          <input
            className={Styles["edit_user_input"]}
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            data-theme={theme}
          />
          <input
            type="file"
            name="avatar"
            onChange={handleChangeFile}
            className={Styles["edit_user_file"]}
            data-theme={theme}
          />
          <input
            className={Styles["edit_user_input"]}
            name="oldPassword"
            type="password"
            placeholder="Старый пароль"
            value={formData.oldPassword}
            onChange={(e) => {
              handleChange(e);
              handlePasswordCheck();
            }}
            data-theme={theme}
          />
          {showNewPassword && (
            <input
              className={Styles["edit_user_input"]}
              name="newPassword"
              type="password"
              placeholder="Новый пароль"
              value={formData.newPassword}
              onChange={handleChange}
              data-theme={theme}
            />
          )}
        </div>
        <button
          onClick={handleSubmit}
          className={Styles["edit_user_btn"]}
          data-theme={theme}
        >
          Сохранить
        </button>
      </div>
    </Modal>
  );
};
