import { VideoList } from "../components/VideoList/VideoList";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthMe, selectIsAuth } from "../features/auth/auth";
import { useEffect } from "react";
import { AppDispatch } from "../store";

export const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuth = useSelector(selectIsAuth);
  console.log(isAuth);

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return (
    <div>
      <VideoList />
    </div>
  );
};
