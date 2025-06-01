import { useDispatch, useSelector } from "react-redux";
import Styles from "./ChanelPage.module.css";
import { useEffect } from "react";
import { getUserById } from "../../features/auth/auth";
import { useParams, Link } from "react-router-dom";
import { RootState, AppDispatch } from "../../store";
import { HeaderChanel } from "../../components/HeaderChanel/HeaderChanel";
import { InfoUserChanel } from "../../components/InfoUserChanel/InfoUserChanel";
import { getUserVideo } from "../../features/videos/videos";

export const ChanelPage = () => {
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
    <section className={Styles["chanel_page"]}>
      <InfoUserChanel
        avatar={user.avatar}
        name={user.name}
        surname={user.surname}
        login={user.login}
        theme={theme}
      />
      <HeaderChanel userId={user._id} theme={theme} />
      <div className={Styles["chanel_last_videos"]}>
        <h2 className={Styles["chanel_last_videos_title"]}>Последние видео</h2>
        <div className={Styles["chanel_last_videos_items"]}>
          {videosLoading ? (
            <p>Загрузка видео...</p>
          ) : userVideos.length > 0 ? (
            userVideos.map((video) => (
              <Link
                to={`/videos/${video._id}`}
                key={video._id}
                className={Styles["video__item"]}
              >
                <div className={Styles["video_item_preview"]}></div>
                <div className={Styles["video_item_info"]}>
                  <div className={Styles["video_item_text"]}>
                    <h4 className={Styles["video_item_title"]}>
                      {video.title}
                    </h4>
                    <Link
                      to={`/chanel/${video.user._id}`}
                      className={Styles["video_item_login"]}
                    >
                      {video.user.login}
                    </Link>
                    <div className={Styles["video_item_details"]}>
                      <p className={Styles["video_item_views"]}>
                        {video.views} просмотров
                      </p>
                      <p>•</p>
                      <p className={Styles["video_item_date"]}>
                        {new Date(video.createdAt).getDate()}.
                        {new Date(video.createdAt).getMonth()}.
                        {new Date(video.createdAt).getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>Пользователь еще не загрузил видео</p>
          )}
        </div>
      </div>
    </section>
  );
};
