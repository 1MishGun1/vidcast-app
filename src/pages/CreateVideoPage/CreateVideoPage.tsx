import { useForm, SubmitHandler } from "react-hook-form";
import Styles from "./CreateVideoPage.module.css";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import axios from "../../api/config";
import { IVideoCreate } from "../../models/video";
import {
  createVideo,
  getVideoById,
  updateVideo,
} from "../../features/videos/videos";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VideoDropzone from "../../components/VideoDropzone/VideoDropzone";

export const CreateVideoPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id: editId } = useParams<{ id: string }>();
  const video = useSelector((state: RootState) =>
    editId ? state.video.single.data[editId] : null
  );
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const { loading, error } = useSelector((state: RootState) => state.video);
  const [tagsInput, setTagsInput] = useState("");
  const navigate = useNavigate();
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
      hlsUrl: "",
      cover: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (editId && !video) {
      dispatch(getVideoById(editId));
    }
  }, [dispatch, editId]);

  useEffect(() => {
    if (video) {
      setValue("title", video.title);
      setValue("description", video.description);
      setTagsInput(video.tags.join(","));
      setValue("cover", video.cover);
      setValue("hlsUrl", video.hlsUrl);
    }
  }, [video]);

  const handleChangeFiles = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: "hlsUrl" | "cover"
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();

      const multerFieldName = fieldName === "hlsUrl" ? "video" : "imgVideo";
      formData.append(multerFieldName, file);

      const uploadUrl =
        fieldName === "hlsUrl" ? "/uploads/videos" : "/uploads/coversVideos";

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

      if (editId) {
        await dispatch(updateVideo({ id: editId, videoData: payload }));
      } else {
        await dispatch(createVideo(payload));
      }
      navigate("/");
    } catch (error) {
      console.error(error);
    }
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
              value={tagsInput}
              className={Styles["form_input"]}
              data-theme={theme}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>
          {video?.cover && video.hlsUrl ? (
            <div className={Styles["preview_file_edit"]}>
              {video?.cover && (
                <div className={Styles["form_row"]}>
                  <label>Текущая обложка:</label>
                  <a
                    href={`http://localhost:3333${video.cover}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`http://localhost:3333${video.cover}`}
                      alt="preview"
                      className={Styles["edit_img"]}
                    />
                  </a>
                </div>
              )}
              {video?.hlsUrl && (
                <div className={Styles["form_row"]}>
                  <label>Текущее видео:</label>
                  <video
                    src={`http://localhost:3333${video.hlsUrl}`}
                    controls
                    className={Styles["edit_video"]}
                  />
                </div>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        <div className={Styles["create_video_right_part"]}>
          <div className={Styles["form_row"]}>
            <label htmlFor="file-video">Файл видео</label>
            <VideoDropzone
              onFileSelect={async (file: File) => {
                try {
                  const formData = new FormData();
                  formData.append("video", file);
                  const { data } = await axios.post(
                    "/uploads/videos",
                    formData
                  );
                  console.log("hlsUrl от сервера:", data);
                  setValue("hlsUrl", data.hlsUrl);
                } catch (error) {
                  console.error("Ошибка загрузки видео:", error);
                }
              }}
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
          <input type="hidden" {...register("cover")} />
          <input type="hidden" {...register("hlsUrl")} />
          <button type="submit" className={Styles["create_video_btn"]}>
            Опубликовать
          </button>
        </div>
      </form>
    </section>
  );
};
