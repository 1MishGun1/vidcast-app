import React, { useEffect, useRef, useState, useCallback } from "react";
import Hls, { Level } from "hls.js";
import screenfull from "screenfull";
import {
  MdPause,
  MdPlayArrow,
  MdVolumeOff,
  MdVolumeUp,
  MdZoomInMap,
  MdZoomOutMap,
  MdOutlineCloseFullscreen,
  MdOutlineOpenInFull,
  MdSettings,
} from "react-icons/md";
import Styles from "./VideoPlayer.module.css";

interface VideoPlayerProps {
  hlsUrl: string;
  cover: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const formatLevelLabel = (level: Level, index: number): string => {
  if (level.height) return `${level.height}p`;
  const fallbackLabels = ["360p", "720p", "1080p"];
  return fallbackLabels[index] || "Неизвестно";
};

type ViewMode = "standard" | "wide" | "fullscreen";

const VideoPlayer: React.FC<VideoPlayerProps> = ({ hlsUrl, cover }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const hls = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("standard");
  const [showControls, setShowControls] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(-1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
    } else if (Hls.isSupported()) {
      if (hls.current) {
        hls.current.destroy();
      }

      const hlsInstance = new Hls();

      hlsInstance.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS.js error:", data);
      });

      hlsInstance.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        console.log("Доступные уровни:", data.levels);
        setLevels(data.levels);
      });

      hlsInstance.loadSource(hlsUrl);
      hlsInstance.attachMedia(video);

      hls.current = hlsInstance;
    } else {
      console.error("HLS not supported in this browser");
    }

    return () => {
      if (hls.current) {
        hls.current.destroy();
        hls.current = null;
      }
    };
  }, [hlsUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setProgress(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  const resetInactivityTimer = useCallback(() => {
    setShowControls(true);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => setShowControls(false), 2000);
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
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [resetInactivityTimer]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
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
    if (videoRef.current) videoRef.current.currentTime = newTime;
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

  // Обработка выбора качества
  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelIndex = parseInt(e.target.value, 10);
    setCurrentLevel(levelIndex);
    if (hls.current) {
      hls.current.currentLevel = levelIndex;
    }
  };

  const handleQualityChangeManual = (levelIndex: number) => {
    setCurrentLevel(levelIndex);
    if (hls.current) {
      hls.current.currentLevel = levelIndex;
    }
    setShowQualityMenu(false);
  };

  return (
    <div
      className={`${Styles["video-container"]} ${Styles[viewMode]}`}
      ref={containerRef}
    >
      <div className={Styles["video-wrapper"]}>
        <video
          ref={videoRef}
          poster={cover}
          className={Styles["video"]}
          onClick={handleVideoClick}
          controls={false}
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
              {levels.length > 0 && (
                <div className={Styles["quality-menu-wrapper"]}>
                  <button
                    className={Styles["quality-button"]}
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                  >
                    <MdSettings size={24} />
                  </button>

                  {showQualityMenu && (
                    <div className={Styles["quality-menu"]}>
                      <div
                        className={`${Styles["quality-option"]} ${
                          currentLevel === -1 ? Styles["active"] : ""
                        }`}
                        onClick={() => handleQualityChangeManual(-1)}
                      >
                        Авто
                      </div>
                      {levels.map((level, index) => (
                        <div
                          key={index}
                          className={`${Styles["quality-option"]} ${
                            currentLevel === index ? Styles["active"] : ""
                          }`}
                          onClick={() => handleQualityChangeManual(index)}
                        >
                          {formatLevelLabel(level, index)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
