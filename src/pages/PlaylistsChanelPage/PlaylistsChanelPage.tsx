import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getUserById, selectIsAuth } from "../../features/auth/auth";
import { RootState, AppDispatch } from "../../store";
import { HeaderChanel } from "../../components/HeaderChanel/HeaderChanel";
import { InfoUserChanel } from "../../components/InfoUserChanel/InfoUserChanel";
import Styles from "./PlaylistsChanelPage.module.css";
import { CreateModalPlaylist } from "../../components/CreateModalPlaylist/CreateModalPlaylist";
import { PlaylistCard } from "../../components/PlaylistCard/PlaylistCard";
import { getPlaylistsByUserId } from "../../features/playlists/playlists";

export const PlaylistsChanelPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedUser: user,
    loading,
    error,
  } = useSelector((state: RootState) => state.auth);
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const [showModal, setShowModal] = useState(false);
  const playlists = useSelector((state: RootState) => state.playlist.playlist);

  const currentUserId = useSelector(
    (state: RootState) => state.auth.currentUser?._id
  );
  const isAuth = useSelector((state: RootState) => state.auth.currentUser);

  const isOwner = isAuth && currentUserId === user?._id;

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
      dispatch(getPlaylistsByUserId(id));
    }
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <section className={Styles["chanel_playlists"]}>
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
      <div className={Styles["chanel_last_playlists"]}>
        <h2 className={Styles["chanel_last_playlists_title"]}>Плейлисты</h2>
        {isOwner && (
          <button
            className={Styles["chanel_playlists_btn"]}
            data-theme={theme}
            onClick={() => setShowModal(true)}
          >
            Создать плейлист
          </button>
        )}
        {showModal && (
          <CreateModalPlaylist onClose={() => setShowModal(false)} />
        )}
        <div className={Styles["playlist_items"]}>
          {playlists.map((pl) => (
            <PlaylistCard key={pl._id} playlist={pl} />
          ))}
        </div>
      </div>
    </section>
  );
};
