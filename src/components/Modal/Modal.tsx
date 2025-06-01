import Styles from "./Modal.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect } from "react";

type TModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export const Modal = ({ children, onClose }: TModalProps) => {
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={Styles["modal_overlay"]}>
      <div
        className={Styles["modal"]}
        data-theme={theme}
        onClick={handleOverlayClick}
      >
        {children}
      </div>
    </div>
  );
};
