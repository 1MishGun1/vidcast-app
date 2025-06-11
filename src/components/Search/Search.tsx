import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./Search.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { IoMdSearch } from "react-icons/io";

export const Search = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={Styles["search__block"]}>
      <input
        type="text"
        placeholder="Найти видео..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={Styles["search__input"]}
        data-theme={theme}
      />
      <button
        type="submit"
        className={Styles["search__btn"]}
        data-theme={theme}
      >
        <IoMdSearch size={24} />
      </button>
    </form>
  );
};
