import Styles from "./Header.module.css";
import { BsCameraVideo } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectIsAuth } from "../../features/auth/auth";
import { Search } from "../Search/Search";

export const Header = () => {
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const isAuth = useSelector(selectIsAuth);

  return (
    <header className={Styles["header"]}>
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
