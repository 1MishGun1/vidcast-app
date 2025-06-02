import { useEffect } from "react";
import Styles from "./LikedVideoPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { getLikedVideo } from "../../features/videos/videos";
import { VideoCard } from "../../components/VideoCard/VideoCard";

export const LikedVideoPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.video
  );

  useEffect(() => {
    dispatch(getLikedVideo());
  }, [dispatch]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

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
