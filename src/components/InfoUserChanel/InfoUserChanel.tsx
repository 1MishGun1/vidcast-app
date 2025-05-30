import Styles from "./InfoUserChanel.module.css";
import no_avatar from "../../assets/no_avatar.png";

interface ChanelInfoProps {
  avatar: string;
  name: string;
  surname: string;
  login: string;
  theme: string;
}

export const InfoUserChanel = ({
  avatar,
  name,
  surname,
  login,
  theme,
}: ChanelInfoProps) => {
  return (
    <>
      <div className={Styles["chanel_cover_user"]}></div>
      <div className={Styles["chanel_user_info"]}>
        <img
          className={Styles["chanel_user_avatar"]}
          src={`http://localhost:3333${avatar}` || no_avatar}
          alt={`${login}'s avatar`}
        />
        <div className={Styles["chanel_user_text_info"]}>
          <h1 className={Styles["chanel_user_name"]}>{`${name} ${surname}`}</h1>
          <h2 className={Styles["chanel_user_login"]}>{`@${login}`}</h2>
          <p className={Styles["chanel_user_count_sub"]}>10 подписчиков</p>
          <button className={Styles["chanel_user_sub_btn"]} data-theme={theme}>
            Подписаться
          </button>
        </div>
      </div>
    </>
  );
};
