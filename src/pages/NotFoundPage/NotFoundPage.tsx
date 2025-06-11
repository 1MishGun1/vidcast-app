import { Link } from "react-router-dom";
import Styles from "./NotFoundPage.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export const NotFoundPage = () => {
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  return (
    <section className={Styles["not_found_page"]}>
      <h1 className={Styles["not_found_code"]}>404</h1>
      <h2 className={Styles["not_found_title"]}>Упс...Что-то пошло не так</h2>
      <Link to={"/"} className={Styles["not_found_home"]} data-theme={theme}>
        Вернуться на главную
      </Link>
    </section>
  );
};
