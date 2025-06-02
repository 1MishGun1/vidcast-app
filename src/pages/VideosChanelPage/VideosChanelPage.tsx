import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserById } from "../../features/auth/auth";
import { RootState, AppDispatch } from "../../store";
import Styles from "./VideosChanelPage.module.css";
import { HeaderChanel } from "../../components/HeaderChanel/HeaderChanel";
import { InfoUserChanel } from "../../components/InfoUserChanel/InfoUserChanel";
import { getUserVideo } from "../../features/videos/videos";
import { VideoCard } from "../../components/VideoCard/VideoCard";

export const VideosChanelPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedUser: user,
    loading,
    error,
  } = useSelector((state: RootState) => state.auth);
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const { data: userVideos, loading: videosLoading } = useSelector(
    (state: RootState) => state.video.userVideos
  );

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
      dispatch(getUserVideo(id));
    }
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <section className={Styles["chanel_videos"]}>
      <InfoUserChanel
        avatar={user.avatar}
        name={user.name}
        surname={user.surname}
        login={user.login}
        theme={theme}
        channelId={user._id}
        coverProfile={user.coverProfile}
      />
      <HeaderChanel userId={user._id} theme={theme} />
      <div className={Styles["chanel_last_videos"]}>
        <h2 className={Styles["chanel_last_videos_title"]}>Видео</h2>
        <div className={Styles["chanel_videos_items"]}>
          {videosLoading ? (
            <p>Загрузка видео...</p>
          ) : userVideos.length > 0 ? (
            userVideos.map((video) => <VideoCard key={video._id} {...video} />)
          ) : (
            <p>Пользователь еще не загрузил видео</p>
          )}
        </div>
      </div>
    </section>
  );
};
