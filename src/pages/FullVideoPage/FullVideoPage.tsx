import { useParams, Link } from "react-router-dom";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import { useState, useEffect } from "react";
import axios from "../../api/config";
import { IVideo } from "../../models/video";
import Styles from "./FullVideoPage.module.css";
import { useSelector, useDispatch } from "react-redux";
import { getVideoTags } from "../../features/videos/videos";
import { selectIsAuth } from "../../features/auth/auth";
import { RootState, AppDispatch } from "../../store";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { HiOutlineBookmark } from "react-icons/hi";
import {
  getFetchReactions,
  toggleReaction,
} from "../../features/reactions/reactions";

const MONTH_NAMES = [
  "Янв.",
  "Фев.",
  "Мар.",
  "Апр.",
  "Мая",
  "Июн.",
  "Июл.",
  "Авг.",
  "Сен.",
  "Окт.",
  "Ноя.",
  "Дек.",
];

export const FullVideoPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const [data, setData] = useState<IVideo | null>(null);
  const isAuth = useSelector(selectIsAuth);
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const reaction = useSelector((state: RootState) => state.reaction);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`/videos/${id}`);
        setData(response.data);
      } catch (err) {
        console.error("Ошибка при загрузке видео:", err);
      }
    };
    fetchVideo();
  }, [id]);

  useEffect(() => {
    dispatch(getVideoTags());
  }, [dispatch]);

  useEffect(() => {
    if (id) dispatch(getFetchReactions(id));
  }, [id]);

  const handleLike = () => {
    if (id) dispatch(toggleReaction({ videoId: id, type: "like" }));
  };

  const handleDislike = () => {
    if (id) dispatch(toggleReaction({ videoId: id, type: "dislike" }));
  };

  if (!data) {
    return <div className={Styles["not_found"]}>Видео не найдено</div>;
  }

  return (
    <section className={Styles["full_video_page"]}>
      <div className={Styles["full_video_left_part"]}>
        <VideoPlayer
          videoUrl={`http://localhost:3333${data.videoUrl}`}
          cover={`http://localhost:3333${data.cover}`}
        />
        <h1 className={Styles["full_video_title"]}>{data?.title}</h1>
        <div className={Styles["full_video_short_info"]}>
          <div className={Styles["full_video_user"]}>
            <img
              className={Styles["user_avatar"]}
              src={`http://localhost:3333${data.user.avatar}`}
              alt={`avatar ${data.user.login}`}
            />
            <div className={Styles["user_info"]}>
              <Link
                to={`/chanel/${data.user._id}`}
                className={Styles["user_login"]}
              >
                {data?.user.login}
              </Link>
              <p>10 подписчиков</p>
            </div>
            <button className={Styles["user_sub_btn"]} data-theme={theme}>
              Подписаться
            </button>
          </div>
          <div className={Styles["full_video_btns"]}>
            {isAuth ? (
              <button
                onClick={handleLike}
                className={Styles["full_video_btn"]}
                data-theme={theme}
              >
                <AiOutlineLike size={26} /> {reaction.likes}
              </button>
            ) : (
              <Link
                to={"/login"}
                onClick={handleLike}
                className={Styles["full_video_btn"]}
                data-theme={theme}
              >
                <AiOutlineLike size={26} /> {reaction.likes}
              </Link>
            )}
            {isAuth ? (
              <button
                onClick={handleDislike}
                className={Styles["full_video_btn"]}
                data-theme={theme}
              >
                <AiOutlineDislike size={26} /> {reaction.dislikes}
              </button>
            ) : (
              <Link
                to={"/login"}
                onClick={handleLike}
                className={Styles["full_video_btn"]}
                data-theme={theme}
              >
                <AiOutlineDislike size={26} /> {reaction.likes}
              </Link>
            )}
            <button
              type="submit"
              className={Styles["full_video_btn"]}
              data-theme={theme}
            >
              <HiOutlineBookmark size={26} /> Сохранить
            </button>
          </div>
        </div>
        <div className={Styles["full_video_more_info"]}>
          <div className={Styles["full_video_views_date"]}>
            <p className={Styles["full_video_views"]}>
              {data.views} просмотров
            </p>
            <p className={Styles["full_video_full_date"]}>
              <p className={Styles["full_video_date"]}>
                {new Date(data.createdAt).getDate()}
              </p>
              <p className={Styles["full_video_date"]}>
                {MONTH_NAMES[new Date(data.createdAt).getMonth()]}
              </p>
              <p className={Styles["full_video_date"]}>
                {new Date(data.createdAt).getFullYear()}
              </p>
            </p>
          </div>
          <div className={Styles["full_video_tags"]}>
            Тег(-и):
            {data.tags.slice(0, 5).map((tag, index) => (
              <span key={index} className={Styles["tag"]}>
                {tag}
              </span>
            ))}
          </div>
          <p className={Styles["full_video_desc"]}>{data.description}</p>
        </div>
      </div>
    </section>
  );
};
