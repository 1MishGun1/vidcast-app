import React, { useRef, useState, useCallback } from "react";
import styles from "./CreateVideoPage.module.css";

interface VideoDropzoneProps {
  onFileSelect: (file: File) => void;
  theme: string;
}

const VideoDropzone: React.FC<VideoDropzoneProps> = ({
  onFileSelect,
  theme,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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
      className={styles["form_input_video"]}
      data-theme={theme}
      onClick={handleClick}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      style={{
        border: dragActive ? "2px dashed #4a90e2" : "2px dashed #ccc",
        backgroundColor: dragActive ? "#eef6ff" : "#f9f9f9",
        width: "100%",
        height: "250px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        textAlign: "center",
        padding: "1rem",
      }}
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
