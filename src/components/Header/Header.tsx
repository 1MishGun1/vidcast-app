import Styles from "./Header.module.css";
import { IoMdSearch } from "react-icons/io";
import { BsCameraVideo } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../features/theme/theme";
import { RootState } from "../../store";
import { selectIsAuth } from "../../features/auth/auth";

export const Header = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const isAuth = useSelector(selectIsAuth);

  return (
    <header className={Styles["header"]}>
      <div className={Styles["search__block"]}>
        <input
          type="text"
          name="search"
          placeholder="Введите запрос"
          className={Styles["search__input"]}
          data-theme={theme}
        />
        <button className={Styles["search__btn"]} data-theme={theme}>
          <IoMdSearch size={24} />
        </button>
        <button onClick={() => dispatch(toggleTheme())}>
          {theme === "light" ? "🌙" : "☀️"} 
        </button>
      </div>
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
