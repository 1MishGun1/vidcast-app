import Styles from "./InfoUserChanel.module.css";
import no_avatar from "../../assets/no_avatar.png";
import no_cover from "../../assets/no_cover.jpg";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../features/auth/auth";
import { Link } from "react-router-dom";
import { useSubscription } from "../../hooks/useSubscription";
import { RootState } from "../../store";
import { useRef, useState } from "react";
import axios from "../../api/config";

interface ChanelInfoProps {
  avatar: string;
  name: string;
  surname: string;
  login: string;
  theme: string;
  channelId: string;
  coverProfile?: string;
}

export const InfoUserChanel = ({
  avatar,
  name,
  surname,
  login,
  theme,
  channelId,
  coverProfile,
}: ChanelInfoProps) => {
  const isAuth = useSelector(selectIsAuth);
  const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
  const isOwner = isAuth && userId === channelId;

  const { isSubscribed, subscribersCount, handleToggleSubscription } =
    useSubscription(channelId, isAuth);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverUrl, setCoverUrl] = useState(
    coverProfile ? `http://localhost:3333${coverProfile}` : ""
  );
  const [tempCover, setTempCover] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTempCover(file);

    const formData = new FormData();
    formData.append("imgUser", file);

    try {
      const { data } = await axios.post("/uploads/coversUsers/", formData);
      setCoverUrl(`http://localhost:3333${data.url}`);
      setTempCover(null);
    } catch (error) {
      console.error("Ошибка загрузки обложки:", error);
    }
  };

  const handleCancel = () => {
    setTempCover(null);
    fileInputRef.current!.value = "";
  };

  return (
    <>
      <div
        className={Styles["chanel_cover_user_wrapper"]}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <img
          className={Styles["chanel_cover_user"]}
          src={coverUrl || no_cover}
          alt="cover"
        />

        {isOwner && isHovering && (
          <div className={Styles["cover_buttons"]}>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={Styles["cover_btn"]}
            >
              Выбрать файл
            </button>
            <button onClick={handleCancel} className={Styles["cover_btn"]}>
              Отменить
            </button>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <div className={Styles["chanel_user_info"]}>
        <img
          className={Styles["chanel_user_avatar"]}
          src={avatar ? `http://localhost:3333${avatar}` : no_avatar}
          alt={`${login}'s avatar`}
        />
        <div className={Styles["chanel_user_text_info"]}>
          <h1 className={Styles["chanel_user_name"]}>{`${name} ${surname}`}</h1>
          <h2 className={Styles["chanel_user_login"]}>{`@${login}`}</h2>
          <p className={Styles["chanel_user_count_sub"]}>
            {subscribersCount} подписчиков
          </p>
          {isAuth ? (
            <button
              className={Styles["chanel_user_sub_btn"]}
              data-theme={theme}
              onClick={handleToggleSubscription}
            >
              {isSubscribed ? "Отписаться" : "Подписаться"}
            </button>
          ) : (
            <Link
              to={"/login"}
              className={Styles["chanel_user_sub_btn"]}
              data-theme={theme}
            >
              Подписаться
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
