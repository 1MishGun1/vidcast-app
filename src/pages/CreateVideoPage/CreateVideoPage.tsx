import { useForm, SubmitHandler } from "react-hook-form";
import Styles from "./CreateVideoPage.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import axios from "../../api/config";
import { IVideoCreate } from "../../models/video";
import { createVideo } from "../../features/videos/videos";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export const CreateVideoPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const { loading, error } = useSelector((state: RootState) => state.video);
  const [tagsInput, setTagsInput] = useState("");
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isValid },
  } = useForm<IVideoCreate>({
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      videoUrl: "",
      cover: "",
    },
    mode: "onChange",
  });

  const handleChangeFiles = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: "videoUrl" | "cover"
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();

      const multerFieldName = fieldName === "videoUrl" ? "video" : "imgVideo";
      formData.append(multerFieldName, file);

      const uploadUrl =
        fieldName === "videoUrl" ? "/uploads/videos" : "/uploads/coversVideos";

      const { data } = await axios.post(uploadUrl, formData);
      setValue(fieldName, data.url);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit: SubmitHandler<IVideoCreate> = async (data) => {
    try {
      const payload: IVideoCreate = {
        ...data,
        tags: tagsInput
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
      };
      await dispatch(createVideo(payload));
    } catch (error) {
      console.error(error);
    }
  };

  const onRedirect = () => {
    if (!error) return <Navigate to={"/"} />;
  };

  return (
    <section className={Styles["create_video_page"]}>
      <h1 className={Styles["create_video_title"]}>Создание видео</h1>
      <form
        className={Styles["create_video_form"]}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={Styles["create_video_left_part"]}>
          <div className={Styles["form_row"]}>
            <label htmlFor="title">Название</label>
            <input
              type="text"
              id="title"
              className={Styles["form_input"]}
              data-theme={theme}
              {...register("title", { required: "Введите название" })}
            />
          </div>
          <div className={Styles["form_row"]}>
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              className={Styles["form_textarea"]}
              data-theme={theme}
              {...register("description", { required: "Введите описание" })}
            />
          </div>
          <div className={Styles["form_row"]}>
            <label htmlFor="tags">Теги</label>
            <input
              type="text"
              id="tags"
              className={Styles["form_input"]}
              data-theme={theme}
              onChange={(e) => setTagsInput(e.target.value)}
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
              onChange={(e) => handleChangeFiles(e, "videoUrl")}
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
              onChange={(e) => handleChangeFiles(e, "cover")}
            />
          </div>
          <button
            type="submit"
            className={Styles["create_video_btn"]}
            onClick={onRedirect}
          >
            Опубликовать
          </button>
        </div>
      </form>
    </section>
  );
};
