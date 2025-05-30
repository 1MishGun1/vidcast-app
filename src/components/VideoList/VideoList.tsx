import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllVideos, getVideoTags } from "../../features/videos/videos";
import { RootState, AppDispatch } from "../../store";
import Styles from "./VideoList.module.css";
import { Link } from "react-router-dom";
// import { getUserById } from "../../features/auth/auth";

export const VideoList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.video
  );
  // const { data: tags } = useSelector((state: RootState) => state.video.tags);

  useEffect(() => {
    dispatch(getAllVideos());
    dispatch(getVideoTags());
    // dispatch(getUserById());
  }, [dispatch]);

  if (loading === true) return <div>Loading videos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className={Styles["video__items"]}>
        {data.map((video) => (
          <Link
            to={`/videos/${video._id}`}
            key={video._id}
            className={Styles["video__item"]}
          >
            <div className={Styles["video_item_preview"]}></div>
            {/* <img src={video.videoUrl} alt={video.title} width="200" /> */}
            <div className={Styles["video_item_info"]}>
              {/* <div className={Styles["video_item_avatar"]}></div> */}
              <div className={Styles["video_item_text"]}>
                <h4 className={Styles["video_item_title"]}>{video.title}</h4>
                {/* <p>
                  {tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </p> */}
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
        ))}
      </div>
    </>
  );
};
