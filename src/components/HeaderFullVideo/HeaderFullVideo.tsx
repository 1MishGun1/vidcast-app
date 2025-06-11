import { Search } from "../Search/Search";
import Styles from "./HeaderFullVideo.module.css";
import { RootState } from "../../store";
import { selectIsAuth } from "../../features/auth/auth";
import { useSelector } from "react-redux";
import { BsCameraVideo } from "react-icons/bs";
import { Link } from "react-router-dom";

export const HeaderFullVideo = () => {
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const isAuth = useSelector(selectIsAuth);
  return (
    <header className={Styles["header"]}>
      <Link to={"/"}>
        <img
          src="/img/logo_vc_long.svg"
          alt="logo_vc"
          className={Styles["header_logo"]}
        />
      </Link>
      <Search />
      {isAuth ? (
        <Link
          to={"/create/video"}
          className={Styles["create__btn"]}
          data-theme={theme}
        >
          <BsCameraVideo size={24} /> Создать
        </Link>
      ) : (
        <Link
          to={"/login"}
          className={Styles["create__btn"]}
          data-theme={theme}
        >
          <BsCameraVideo size={24} /> Создать
        </Link>
      )}
    </header>
  );
};
