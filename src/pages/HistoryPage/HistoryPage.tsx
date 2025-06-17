import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../../features/history/history";
import { RootState } from "../../store";
import { VideoCard } from "../../components/VideoCard/VideoCard";
import { AppDispatch } from "../../store";
import Styles from "./HistoryPage.module.css";
import { groupHistoryByDate } from "../../utils/groupHistoryByDate";

export const HistoryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: history, status } = useSelector(
    (state: RootState) => state.history
  );
  const groupedHistory = groupHistoryByDate(history);

  useEffect(() => {
    dispatch(fetchHistory());
  }, []);

  return (
    <div className={Styles["history_page"]}>
      <h2 className={Styles["history_title"]}>История просмотров</h2>
      {Object.entries(groupedHistory).map(([date, videos]) => (
        <div key={date}>
          <h3 className={Styles["history_date"]}>{date}</h3>
          <div className={Styles["history_items"]}>
            {videos.map((item) => (
              <VideoCard key={item._id} {...item.video} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
