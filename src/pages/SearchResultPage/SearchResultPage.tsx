import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSearchResults,
  clearSearchResults,
} from "../../features/search/search";
import { RootState, AppDispatch } from "../../store";
import Styles from "./SearchResultPage.module.css";
import { VideoCard } from "../../components/VideoCard/VideoCard";

export const SearchResultPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { results, loading, error } = useSelector(
    (state: RootState) => state.search
  );

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      dispatch(fetchSearchResults(query));
    }

    return () => {
      dispatch(clearSearchResults());
    };
  }, [query, dispatch]);

  return (
    <section className={Styles["search_page"]}>
      <h2 className={Styles["search_title"]}>
        Результаты поиска для: "{query}"
      </h2>
      <div className={Styles["search_items"]}>
        {" "}
        {results && results.length > 0 ? (
          results.map((video) => (
            <VideoCard key={video._id} {...video} layout="horizontal" />
          ))
        ) : (
          <p>Видео не найдены</p>
        )}
      </div>
    </section>
  );
};
