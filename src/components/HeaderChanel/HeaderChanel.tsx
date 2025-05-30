import { NavLink } from "react-router-dom";
import Styles from "./HeaderChanel.module.css";

interface ChanelNavigationProps {
  userId: string;
  theme: string;
}

const isActive = ({ isActive }: { isActive: boolean }) =>
  isActive ? Styles["chanel_nav_link_active"] : Styles["chanel_nav_link"];

export const HeaderChanel = ({ userId, theme }: ChanelNavigationProps) => {
  return (
    <nav className={Styles["chanel_nav"]} data-theme={theme}>
      <NavLink className={isActive} to={`/chanel/${userId}`}>
        Главная
      </NavLink>
      <NavLink className={isActive} to={`/chanel/videos/${userId}`}>
        Видео
      </NavLink>
      <NavLink className={isActive} to={`/chanel/playlists/${userId}`}>
        Плейлисты
      </NavLink>
    </nav>
  );
};
