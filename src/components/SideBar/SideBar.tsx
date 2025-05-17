import { HiMenu, HiMenuAlt1 } from "react-icons/hi";
import Styles from "./SideBar.module.css";

import { FaRegUserCircle, FaFireAlt, FaHistory } from "react-icons/fa";
import { RiPlayList2Fill } from "react-icons/ri";
import { BiLike } from "react-icons/bi";
import { useState } from "react";

export const SideBar = () => {
  const [isShort, setIsShort] = useState(false);

  const toggleSideBar = () => {
    setIsShort(!isShort);
  };

  return (
    <aside className={`${Styles.aside} ${isShort ? Styles.aside_short : ""}`}>
      <nav className={Styles.nav__aside}>
        <div className={Styles.sidebar__header}>
          <button onClick={toggleSideBar} className={Styles.collapse__button}>
            {isShort ? <HiMenu size={24} /> : <HiMenuAlt1 size={24} />}
          </button>
          <li
            className={Styles.nav_logo__item}
            onClick={toggleSideBar}
            style={{ cursor: "pointer" }}
          >
            {isShort ? (
              <img
                src="/img/logo_white_short.svg"
                alt="logo"
                className={Styles.logo_short}
              />
            ) : (
              <img
                src="/img/logo_white_long.svg"
                alt="logo"
                className={Styles.logo}
              />
            )}
          </li>
        </div>

        <ul className={Styles.nav__items}>
          <li className={Styles.nav__item}>
            <FaFireAlt size={24} />
            {!isShort && <span>Тренды</span>}
          </li>
          <li className={Styles.nav__item}>
            <FaRegUserCircle size={24} />
            {!isShort && <span>Ваш канал</span>}
          </li>
          <li className={Styles.nav__item}>
            <RiPlayList2Fill size={24} />
            {!isShort && <span>Плейлисты</span>}
          </li>
          <li className={Styles.nav__item}>
            <FaHistory size={24} />
            {!isShort && <span>История</span>}
          </li>
          <li className={Styles.nav__item}>
            <BiLike size={24} />
            {!isShort && <span>Лайки</span>}
          </li>
        </ul>
      </nav>
    </aside>
  );
};
