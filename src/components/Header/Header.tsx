import Styles from "./Header.module.css";
import { IoMdSearch } from "react-icons/io";
import { BsCameraVideo } from "react-icons/bs";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className={Styles["header"]}>
      <div className={Styles["search__block"]}>
        <input
          type="text"
          name="search"
          placeholder="Введите запрос"
          className={Styles["search__input"]}
        />
        <button className={Styles["search__btn"]}>
          <IoMdSearch size={24} />
        </button>
      </div>
      <Link to={"/"} className={Styles["create__btn"]}>
        <BsCameraVideo size={24} /> Создать
      </Link>
    </header>
  );
};
