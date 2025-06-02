import { Link } from "react-router-dom";
import Styles from "./VideoCard.module.css";
import no_avatar from "../../assets/no_avatar.png";

interface IVideoInfoProps {
  _id: string;
  cover: string;
  title: string;
  user: {
    _id: string;
    login: string;
    avatar: string;
  };
  views: number;
  createdAt: string;
}

export const VideoCard = ({
  _id,
  cover,
  title,
  user,
  views,
  createdAt,
}: IVideoInfoProps) => {
  return (
    <Link to={`/videos/${_id}`} key={_id} className={Styles["video__item"]}>
      <img
        src={`http://localhost:3333${cover}`}
        alt={title}
        className={Styles["video_item_preview"]}
      />
      <div className={Styles["video_item_info"]}>
        <img
          src={user.avatar ? `http://localhost:3333${user.avatar}` : no_avatar}
          className={Styles["video_item_avatar"]}
          alt=""
        />
        <div className={Styles["video_item_text"]}>
          <h4 className={Styles["video_item_title"]}>{title}</h4>
          <div className={Styles["video_item_user"]}>
            <Link
              to={`/chanel/${user._id}`}
              className={Styles["video_item_login"]}
            >
              {user.login}
            </Link>
          </div>
          <div className={Styles["video_item_details"]}>
            <p className={Styles["video_item_views"]}>{views} просмотров</p>
            <p>•</p>
            <p className={Styles["video_item_date"]}>
              {new Date(createdAt).getDate()}.{new Date(createdAt).getMonth()}.
              {new Date(createdAt).getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
