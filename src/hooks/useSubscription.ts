import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleSubscription,
  checkSubscription,
  fetchSubscribersCount,
} from "../features/subscribe/subscribe";
import { RootState, AppDispatch } from "../store";

export const useSubscription = (
  channelId: string | undefined,
  isAuth: boolean
) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isSubscribed, subscribersCount } = useSelector(
    (state: RootState) => state.subscribe.currentChannelStatus
  );

  useEffect(() => {
    if (!channelId) return;

    if (isAuth) {
      dispatch(checkSubscription(channelId));
    } else {
      dispatch(fetchSubscribersCount(channelId));
    }
  }, [channelId, isAuth, dispatch]);

  const handleToggleSubscription = () => {
    if (!channelId) return;
    dispatch(toggleSubscription(channelId));
  };

  return { isSubscribed, subscribersCount, handleToggleSubscription };
};
