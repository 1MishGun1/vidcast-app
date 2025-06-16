import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { hideBanModal } from "../../features/banUsers/banUsers";
import { Modal } from "../Modal/Modal";

import Styles from "./BanInfoModal.module.css";

type PropsModal = {
  onClose: () => void;
};

export const BanModal = ({ onClose }: PropsModal) => {
  const dispatch = useDispatch();
  const { show, reason, expiresAt, isPermanent } = useSelector(
    (state: RootState) => state.ban
  );
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  if (!show) return null;

  return (
    <Modal onClose={onClose}>
      <div className={Styles["modal_content"]}>
        <h2 className={Styles["modal_title"]}>Аккаунт заблокирован</h2>
        <p className={Styles["modal_text"]}>
          <strong>Причина:</strong> {reason || "Не указана"}
        </p>
        {isPermanent ? (
          <p className={Styles["modal_perm_ban"]}>
            <strong>Срок:</strong> Навсегда
          </p>
        ) : (
          <p className={Styles["modal_time_ban"]}>
            <strong>До:</strong> {new Date(expiresAt!).toLocaleString()}
          </p>
        )}
        <button
          onClick={() => dispatch(hideBanModal())}
          className={Styles["modal_close"]}
          data-theme={theme}
        >
          Закрыть
        </button>
      </div>
    </Modal>
  );
};
