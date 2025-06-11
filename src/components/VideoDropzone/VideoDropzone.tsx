import React, { useRef, useState } from "react";
import Styles from "./VideoDropzone.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface VideoDropzoneProps {
  onFileSelect: (file: File) => void;
}

const VideoDropzone: React.FC<VideoDropzoneProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const videoFile = Array.from(files).find((file) =>
      file.type.startsWith("video/")
    );
    if (videoFile) {
      onFileSelect(videoFile);
      setFileName(videoFile.name);
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

  const handleClick = () => {
    inputRef.current?.click();
  };

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
        <p>{fileName}</p>
      ) : (
        <p>Перетащите видео или нажмите, чтобы выбрать</p>
      )}
    </div>
  );
};

export default VideoDropzone;
