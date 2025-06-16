import { Link, useNavigate, useParams } from "react-router-dom";
import Styles from "./VideoCard.module.css";
import no_avatar from "../../assets/no_avatar.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { deleteVideo } from "../../features/videos/videos";
import { MdDelete, MdModeEdit } from "react-icons/md";
import Hls from "hls.js";
import { useState, useEffect, useRef } from "react";

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

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  const userId = useSelector((state: RootState) => state.auth.currentUser?._id);
  const isAuthor = userId === user._id;

  // ✅ Формируем корректный HLS URL
  const correctHlsUrl = hlsUrl.startsWith("http")
    ? hlsUrl
    : `http://localhost:3333${hlsUrl}`;

  // ✅ Получение длительности видео
  useEffect(() => {
    const tempVideo = document.createElement("video");

    const getDuration = () => {
      return new Promise<number>((resolve, reject) => {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(correctHlsUrl);
          hls.attachMedia(tempVideo);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            tempVideo.onloadedmetadata = () => {
              resolve(tempVideo.duration);
              hls.destroy();
            };
          });

          hls.on(Hls.Events.ERROR, (_, data) => {
            console.error("HLS error while getting duration", data);
            reject("HLS Error");
          });
        } else if (tempVideo.canPlayType("application/vnd.apple.mpegurl")) {
          tempVideo.src = correctHlsUrl;
          tempVideo.onloadedmetadata = () => {
            resolve(tempVideo.duration);
          };
          tempVideo.onerror = () => reject("Native video error");
        } else {
          reject("HLS not supported");
        }
      });
    };

    getDuration()
      .then(setDuration)
      .catch((err) => console.warn("Failed to load duration:", err));
  }, [correctHlsUrl]);

  // ✅ Воспроизведение превью, если нет обложки
  useEffect(() => {
    if (!videoRef.current || cover) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(correctHlsUrl);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = correctHlsUrl;
    }
  }, [correctHlsUrl, cover]);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm("Удалить видео?")) {
      dispatch(deleteVideo(_id));
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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
            onClick={(e) => e.stopPropagation()}
          >
            <MdModeEdit />
          </Link>
        </>
      )}

      <div className={Styles["video_item_preview_wrapper"]}>
        {cover ? (
          <img
            src={`http://localhost:3333${cover}`}
            alt={title}
            className={`${Styles["video_item_preview"]} ${
              layout === "short" ? Styles["video_item_preview_short"] : ""
            }`}
          />
        ) : (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            className={`${Styles["video_item_preview"]} ${
              layout === "short" ? Styles["video_item_preview_short"] : ""
            }`}
          />
        )}

        {duration !== null && (
          <span className={Styles["video_item_duration"]}>
            {formatTime(duration)}
          </span>
        )}
      </div>

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
