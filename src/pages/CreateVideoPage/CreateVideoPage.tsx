import { useForm, SubmitHandler } from "react-hook-form";
import Styles from "./CreateVideoPage.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export const CreateVideoPage = () => {
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  return (
    <section className={Styles["create_video_page"]}>
      <h1 className={Styles["create_video_title"]}>Создание видео</h1>
      <form className={Styles["create_video_form"]}>
        <div className={Styles["create_video_left_part"]}>
          <div className={Styles["form_row"]}>
            <label htmlFor="title">Название</label>
            <input
              type="text"
              id="title"
              className={Styles["form_input"]}
              data-theme={theme}
            />
          </div>
          <div className={Styles["form_row"]}>
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              className={Styles["form_textarea"]}
              data-theme={theme}
            />
          </div>
          <div className={Styles["form_row"]}>
            <label htmlFor="tags">Теги</label>
            <input
              type="text"
              id="tags"
              className={Styles["form_input"]}
              data-theme={theme}
            />
          </div>
        </div>
        <div className={Styles["create_video_right_part"]}>
          <div className={Styles["form_row"]}>
            <label htmlFor="file-video">Файл видео</label>
            <input
              type="file"
              id="file-video"
              className={Styles["form_input_video"]}
              data-theme={theme}
            />
          </div>
          <div className={Styles["form_row"]}>
            <label
              htmlFor="file-cover"
              className={Styles["file_cover_btn"]}
              data-theme={theme}
            >
              Обложка видео
            </label>
            <input
              type="file"
              id="file-cover"
              className={Styles["form_input_cover"]}
              data-theme={theme}
            />
          </div>
          <button type="submit" className={Styles["create_video_btn"]}>
            Опубликовать
          </button>
        </div>
      </form>
    </section>
  );
};
