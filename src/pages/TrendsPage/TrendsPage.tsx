import { useEffect } from "react";
import Styles from "./TrendsPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getTrendingVideos } from "../../features/videos/videos";
import { VideoCard } from "../../components/VideoCard/VideoCard";
import { Link } from "react-router-dom";

export const TrendsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.video
  );
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  useEffect(() => {
    dispatch(getTrendingVideos());
  }, [dispatch]);

  if (loading) return <p>Загрузка трендов...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!data.length)
    return (
      <div className={Styles["no_trends"]}>
        <p className={Styles["trend_no_trends"]}>Трендовых видео пока нет</p>
        <Link to={"/"} className={Styles["no_trends_home"]} data-theme={theme}>
          Вернуться на главную
        </Link>
      </div>
    );

  return (
    <section className={Styles["trend_page"]}>
      <h2 className={Styles["trend_title"]}>Тренды</h2>
      <div className={Styles["trend_items"]}>
        {data.map((video) => (
          <VideoCard
            key={video._id}
            _id={video._id}
            cover={video.cover}
            hlsUrl={video.hlsUrl}
            title={video.title}
            user={video.user}
            views={video.views}
            createdAt={video.createdAt}
          />
        ))}
      </div>
    </section>
  );
};
