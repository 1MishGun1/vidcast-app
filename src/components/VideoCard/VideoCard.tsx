import { Link, useNavigate, useParams } from "react-router-dom";
import Styles from "./VideoCard.module.css";
import no_avatar from "../../assets/no_avatar.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { deleteVideo } from "../../features/videos/videos";
import { MdDelete, MdModeEdit } from "react-icons/md";

interface IVideoInfoProps {
  _id: string;
  cover: string;
  hlsUrl: string;
  title: string;
  user: {
    _id: string;
    login: string;
    avatar: string;
  };
  views: number;
  createdAt: string;
  layout?: "default" | "horizontal" | "short";
}

export const VideoCard = ({
  _id,
  cover,
  hlsUrl,
  title,
  user,
  views,
  createdAt,
  layout,
}: IVideoInfoProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
  const isAuthor = userId === user._id;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm("Удалить видео?")) {
      dispatch(deleteVideo(_id));
    }
  };

  return (
    <Link
      to={`/videos/${_id}`}
      key={_id}
      className={`${Styles["video__item"]} ${
        layout === "horizontal" ? Styles["video__item_horizontal"] : ""
      } ${layout === "short" ? Styles["video__item_short"] : ""}`}
    >
      {isAuthor && (
        <>
          <button
            className={Styles["video__delete_button"]}
            onClick={handleDelete}
          >
            <MdDelete />
          </button>
          <Link
            to={`/create/video/${_id}`}
            className={Styles["video__edit_button"]}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MdModeEdit />
          </Link>
        </>
      )}
      {cover ? (
        <img
          src={`http://localhost:3333${cover}`}
          alt={title}
          className={`${Styles["video_item_preview"]} ${
            layout === "short" ? Styles["video_item_preview_short"] : ""
          }`}
        />
      ) : (
        <video className={Styles["video_item_preview_video"]} />
      )}
      <div
        className={`${Styles["video_item_info"]} ${
          layout === "horizontal" ? Styles["video_item_info_horizontal"] : ""
        } ${layout === "short" ? Styles["video_item_info_short"] : ""}`}
      >
        <img
          src={user.avatar ? `http://localhost:3333${user.avatar}` : no_avatar}
          className={`${Styles["video_item_avatar"]} ${
            layout === "short" ? Styles["video_item_avatar_short"] : ""
          }`}
          alt=""
        />
        <div className={Styles["video_item_text"]}>
          <h4
            className={`${Styles["video_item_title"]} ${
              layout === "horizontal"
                ? Styles["video_item_title_horizontal"]
                : ""
            } ${layout === "short" ? Styles["video_item_title_short"] : ""}`}
          >
            {title}
          </h4>
          <div className={Styles["video_item_user"]}>
            <Link
              to={`/chanel/${user._id}`}
              className={Styles["video_item_login"]}
            >
              {user.login}
            </Link>
          </div>
          <div
            className={`${Styles["video_item_details"]} ${
              layout === "horizontal"
                ? Styles["video_item_details_horizontal"]
                : ""
            } ${layout === "short" ? Styles["video_item_details_short"] : ""}`}
          >
            <p className={Styles["video_item_views"]}>{views} просмотров</p>
            <p>•</p>
            <p className={Styles["video_item_date"]}>
              {new Date(createdAt).getDate()}.
              {new Date(createdAt).getMonth() + 1}.
              {new Date(createdAt).getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
