import React, { useRef, useState } from "react";
import Styles from "./VideoDropzone.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { uploadVideoWithProgress } from "../../utils/uploadVideoWithProgress";
import axios from "../../api/config";

interface VideoDropzoneProps {
  onFileSelect: (file: File) => void;
}

const VideoDropzone: React.FC<VideoDropzoneProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [hlsProcessing, setHlsProcessing] = useState(false);
  const [hlsReady, setHlsReady] = useState(false);
  // const [hlsProgress, setHlsProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  const checkHlsReady = async (hlsUrl: string) => {
    try {
      let attempts = 0;
      setHlsProcessing(true);

      const interval = setInterval(async () => {
        try {
          await axios.get(hlsUrl, { timeout: 1000 });
          clearInterval(interval);
          setHlsProcessing(false);
          setHlsReady(true);
        } catch {
          attempts++;
          if (attempts > 30) {
            clearInterval(interval);
            setError("Обработка HLS заняла слишком много времени.");
            setHlsProcessing(false);
          }
        }
      }, 2000);
    } catch (err) {
      console.error("Ошибка при проверке HLS:", err);
    }
  };

  // const checkHlsProgress = async (videoId: string) => {
  //   setHlsProcessing(true);
  //   let intervalId = setInterval(async () => {
  //     try {
  //       const res = await axios.get(`/api/video-progress/${videoId}`);
  //       const progresses = res.data;

  //       const averageProgress =
  //         Object.values(progresses).reduce((acc, val) => acc + val, 0) /
  //         Object.keys(progresses).length;

  //       setHlsProgress(Math.floor(averageProgress));

  //       if (averageProgress >= 100) {
  //         clearInterval(intervalId);
  //         setHlsProcessing(false);
  //         setHlsReady(true);
  //       }
  //     } catch (err) {
  //       console.error("Ошибка при проверке прогресса HLS", err);
  //     }
  //   }, 2000);
  // };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const videoFile = Array.from(files).find((file) =>
      file.type.startsWith("video/")
    );
    if (videoFile) {
      setError(null);
      onFileSelect(videoFile);
      setFileName(videoFile.name);
      try {
        const res = await uploadVideoWithProgress(videoFile, setProgress);
        if (res.hlsUrl) {
          checkHlsReady(res.hlsUrl);
        }
      } catch (err) {
        setError("Ошибка при загрузке видео");
      }
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => inputRef.current?.click();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div
      className={`${Styles.dropzone} ${dragActive ? Styles.dragActive : ""}`}
      data-theme={theme}
      onClick={handleClick}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="video/*"
        ref={inputRef}
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {fileName ? (
        <div className={Styles["drag_text"]}>
          <p>Файл: {fileName}</p>
          <p>Загрузка: {progress}%</p>
          {progress === 100 && !hlsProcessing && !hlsReady && (
            <p>Видео загружено, ожидаем HLS…</p>
          )}
          {hlsProcessing && <p>Обработка HLS...</p>}
          {hlsReady && (
            <p style={{ color: "green" }}>Готово! Видео можно смотреть</p>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <p>Перетащите видео или нажмите, чтобы выбрать</p>
      )}
    </div>
  );
};
export default VideoDropzone;
