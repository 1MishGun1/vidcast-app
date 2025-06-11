import { useEffect } from "react";
import Styles from "./LikedVideoPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { getLikedVideo } from "../../features/videos/videos";
import { VideoCard } from "../../components/VideoCard/VideoCard";
import { Link } from "react-router-dom";

export const LikedVideoPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.video
  );
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  useEffect(() => {
    dispatch(getLikedVideo());
  }, [dispatch]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!data.length)
    return (
      <div className={Styles["no_likes"]}>
        <p className={Styles["like_no_likes"]}>Понравившихся видео пока нет</p>
        <Link to={"/"} className={Styles["no_likes_home"]} data-theme={theme}>
          Вернуться на главную
        </Link>
      </div>
    );

  return (
    <section className={Styles["like_page"]}>
      <h2 className={Styles["like_title"]}>Понравившиеся видео</h2>
      <div className={Styles["video_like_items"]}>
        {data.map((video) => (
          <VideoCard key={video._id} {...video} />
        ))}
      </div>
    </section>
  );
};
