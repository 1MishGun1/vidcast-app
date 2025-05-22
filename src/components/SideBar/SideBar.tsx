import Styles from "./SideBar.module.css";

import { FaRegUserCircle, FaFireAlt, FaHistory } from "react-icons/fa";
import { RiPlayList2Fill } from "react-icons/ri";
import { BiLike } from "react-icons/bi";
import { PiSignInBold } from "react-icons/pi";
// import { HiMenu, HiMenuAlt1 } from "react-icons/hi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useState } from "react";
import { Link } from "react-router-dom";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

export const SideBar = () => {
  const [isShort, setIsShort] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  const toggleSideBar = () => {
    setIsShort(!isShort);
  };

  const getLogoPath = (isShort: boolean) => {
    if (theme === "dark") {
      return isShort ? "/img/logo_vc_short.svg" : "/img/logo_vc_long.svg";
    } else {
      return isShort ? "/img/logo_vc_short.svg" : "/img/logo_vc_long.svg";
    }
  };

  return (
    <aside className={`${Styles.aside} ${isShort ? Styles.aside_short : ""}`}>
      <nav className={Styles.nav__aside}>
        <div className={Styles.sidebar__header}>
          <Link
            to={"/"}
            className={Styles.nav_logo__item}
            onClick={toggleSideBar}
          >
            <img
              src={getLogoPath(isShort)}
              alt="logo"
              className={isShort ? Styles.logo_short : Styles.logo}
              onMouseEnter={() => setIsHidden(true)}
              onMouseLeave={() => setIsHidden(false)}
            />
          </Link>
          <button
            onClick={toggleSideBar}
            className={`${Styles.collapse__button} ${
              !isHidden ? Styles.hidden__logo : ""
            }`}
            data-theme={theme}
          >
            {isShort ? <FaAngleRight size={20} /> : <FaAngleLeft size={20} />}
          </button>
        </div>

        <div className={Styles.nav__items}>
          <Link to={"/"} className={Styles.nav__item}>
            <FaFireAlt size={24} />
            {!isShort && <span>Тренды</span>}
          </Link>
          <Link to={"/"} className={Styles.nav__item}>
            <FaRegUserCircle size={24} />
            {!isShort && <span>Ваш канал</span>}
          </Link>
          <Link to={"/"} className={Styles.nav__item}>
            <RiPlayList2Fill size={24} />
            {!isShort && <span>Плейлисты</span>}
          </Link>
          <Link to={"/"} className={Styles.nav__item}>
            <FaHistory size={24} />
            {!isShort && <span>История</span>}
          </Link>
          <Link to={"/"} className={Styles.nav__item}>
            <BiLike size={24} />
            {!isShort && <span>Лайки</span>}
          </Link>
          <Link
            to={"/login"}
            className={Styles.nav__item_sign}
            data-theme={theme}
          >
            <PiSignInBold size={24} />
            {!isShort && <span>Войти</span>}
          </Link>
        </div>
      </nav>
    </aside>
  );
};
