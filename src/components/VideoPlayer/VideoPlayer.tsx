import React, { useRef, useState, useEffect, useCallback } from "react";
import screenfull from "screenfull";
import {
  MdPlayArrow,
  MdPause,
  MdVolumeUp,
  MdVolumeOff,
  MdOutlineOpenInFull,
  MdOutlineCloseFullscreen,
  MdZoomOutMap,
  MdZoomInMap,
} from "react-icons/md";
import Styles from "./VideoPlayer.module.css";

interface VideoPlayerProps {
  videoUrl: string;
  cover: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

type ViewMode = "standard" | "wide" | "fullscreen";

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, cover }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("standard");
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setProgress(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  const resetInactivityTimer = useCallback(() => {
    setShowControls(true);
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", resetInactivityTimer);
    container.addEventListener("click", resetInactivityTimer);
    resetInactivityTimer();

    return () => {
      container.removeEventListener("mousemove", resetInactivityTimer);
      container.removeEventListener("click", resetInactivityTimer);
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [resetInactivityTimer]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    setProgress(newTime);
  };

  const toggleWideScreen = () => {
    setViewMode((prev) => (prev === "wide" ? "standard" : "wide"));
  };

  const toggleFullScreen = () => {
    if (screenfull.isEnabled) {
      if (screenfull.isFullscreen) {
        screenfull.exit();
        setViewMode("standard");
      } else if (containerRef.current) {
        screenfull.request(containerRef.current);
        setViewMode("fullscreen");
      }
    }
  };

  return (
    <div
      className={`${Styles["video-container"]} ${Styles[viewMode]}`}
      ref={containerRef}
    >
      <div className={Styles["video-wrapper"]}>
        <video
          ref={videoRef}
          src={videoUrl}
          poster={cover}
          className={Styles["video"]}
          onClick={handleVideoClick}
        />
      </div>
      {showControls && (
        <div className={Styles["controls-container"]}>
          <div className={Styles["video-progress"]}>
            <input
              type="range"
              min="0"
              max={duration}
              step="0.1"
              value={progress}
              onChange={handleProgressChange}
              className={Styles["video-progress-line"]}
              style={{
                // @ts-ignore
                "--progress": `${(progress / duration) * 100}%`,
              }}
            />
          </div>
          <div className={Styles["controls"]}>
            <div className={Styles["video-info"]}>
              <button onClick={togglePlay}>
                {isPlaying ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
              </button>
              <div className={Styles["volume-control"]}>
                <button onClick={toggleMute}>
                  {isMuted || volume === 0 ? (
                    <MdVolumeOff size={24} />
                  ) : (
                    <MdVolumeUp size={24} />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className={Styles["volume-progress"]}
                />
              </div>
            </div>
            <div className={Styles["button-views"]}>
              <p className={Styles["timeline-progress"]}>
                {formatTime(progress)} / {formatTime(duration)}
              </p>
              <button onClick={toggleWideScreen}>
                {viewMode === "wide" ? (
                  <MdZoomInMap size={24} />
                ) : (
                  <MdZoomOutMap size={24} />
                )}
              </button>
              <button onClick={toggleFullScreen}>
                {viewMode === "fullscreen" ? (
                  <MdOutlineCloseFullscreen size={24} />
                ) : (
                  <MdOutlineOpenInFull size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
