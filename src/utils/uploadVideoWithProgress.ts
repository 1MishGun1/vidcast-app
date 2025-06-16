import axios from "../api/config";

export const uploadVideoWithProgress = async (
  file: File,
  onProgress: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append("video", file);

  const response = await axios.post("/uploads/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      const percent = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total || 1)
      );
      onProgress(percent);
    },
  });

  return response.data;
};
