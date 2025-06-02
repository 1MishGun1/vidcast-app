import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import axios from "../../api/config";
import { IPlaylist } from "../../models/playlist";
import { IVideo } from "../../models/video";
import { VideoCard } from "../../components/VideoCard/VideoCard";
import Styles from "./PlaylistPage.module.css";

export const PlaylistPage = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState<IPlaylist | null>(null);
  const [videos, setVideos] = useState<IVideo[]>([]);
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axios.get(`/playlist/${id}`);
        setPlaylist(res.data);
        setVideos(res.data.videos); // уже populated видео
      } catch (err) {
        console.error("Ошибка загрузки плейлиста:", err);
      }
    };

    if (id) fetchPlaylist();
  }, [id]);

  if (!playlist) return <div>Загрузка...</div>;

  return (
    <section className={Styles["playlist_page"]}>
      <h1 className={Styles.title}>Плейлист: {playlist["title"]}</h1>
      <div className={Styles["playlist_content"]}>
        <p className={Styles.description}>
          Описание: {playlist["description"]}
        </p>
        <div className={Styles["videos_items"]}>
          {videos.map((video) => (
            <VideoCard key={video._id} {...video} />
          ))}
        </div>
      </div>
    </section>
  );
};
