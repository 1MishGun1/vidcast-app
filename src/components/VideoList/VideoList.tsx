import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllVideos, getVideoTags } from "../../features/videos/videos";
import { RootState, AppDispatch } from "../../store";
import Styles from "./VideoList.module.css";
import { VideoCard } from "../VideoCard/VideoCard";

export const VideoList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.video
  );

  useEffect(() => {
    dispatch(getAllVideos());
    dispatch(getVideoTags());
  }, [dispatch]);

  if (loading === true) return <div>Loading videos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className={Styles["video__items"]}>
        {data.map((video) => (
          <VideoCard key={video._id} {...video} />
        ))}
      </div>
    </>
  );
};
