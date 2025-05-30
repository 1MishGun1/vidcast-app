import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserById } from "../../features/auth/auth";
import { RootState, AppDispatch } from "../../store";
import Styles from "./VideosChanelPage.module.css";
import { HeaderChanel } from "../../components/HeaderChanel/HeaderChanel";
import { InfoUserChanel } from "../../components/InfoUserChanel/InfoUserChanel";

export const VideosChanelPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    selectedUser: user,
    loading,
    error,
  } = useSelector((state: RootState) => state.auth);
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id));
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
      />
      <HeaderChanel userId={user._id} theme={theme} />
      <div className={Styles["chanel_last_videos"]}>
        <h2 className={Styles["chanel_last_videos_title"]}>Видео</h2>
      </div>
    </section>
  );
};
