import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllVideos, getVideoTags } from "../../features/videos/videos";
import { RootState, AppDispatch } from "../../store";
import Styles from "./VideoCard.module.css";

interface IVideoInfoProps {
  _id: string;
  cover: string;
  title: string;
  user: {
    _id: string;
    login: string;
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
      {/* <div className={Styles["video_item_preview"]}></div> */}
      <img
        src={`http://localhost:3333${cover}`}
        alt={title}
        className={Styles["video_item_preview"]}
      />
      <div className={Styles["video_item_info"]}>
        {/* <div className={Styles["video_item_avatar"]}></div> */}
        <div className={Styles["video_item_text"]}>
          <h4 className={Styles["video_item_title"]}>{title}</h4>
          {/* <p>
                  {tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </p> */}
          <Link
            to={`/chanel/${user._id}`}
            className={Styles["video_item_login"]}
          >
            {user.login}
          </Link>
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
