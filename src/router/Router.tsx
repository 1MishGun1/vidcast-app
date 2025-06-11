import { Routes, Route } from "react-router-dom";
import { Layout } from "../components/Layout/Layout";
import { HomePage } from "../pages/HomePage";
import { FullVideoPage } from "../pages/FullVideoPage/FullVideoPage";
import { AuthLayout } from "../components/AuthLayout/AuthLayout";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { RegisterPage } from "../pages/RegisterPage/RegisterPage";
import { CreateVideoPage } from "../pages/CreateVideoPage/CreateVideoPage";
import { ChanelPage } from "../pages/ChanelPage/ChanelPage";
import { VideosChanelPage } from "../pages/VideosChanelPage/VideosChanelPage";
import { PlaylistsChanelPage } from "../pages/PlaylistsChanelPage/PlaylistsChanelPage";
import { LikedVideoPage } from "../pages/LikedVideoPage/LikedVideoPage";
import { PlaylistPage } from "../pages/PlaylistPage/PlaylistPage";
import { TrendsPage } from "../pages/TrendsPage/TrendsPage";
import { SearchResultPage } from "../pages/SearchResultPage/SearchResultPage";
import { FullVideoLayout } from "../components/FullVideoLayout/FullVideoLayout";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/create/video" element={<CreateVideoPage />} />
        <Route path="/create/video/:id" element={<CreateVideoPage />} />
        <Route path="/chanel/:id" element={<ChanelPage />} />
        <Route path="/chanel/videos/:id" element={<VideosChanelPage />} />
        <Route path="/chanel/playlists/:id" element={<PlaylistsChanelPage />} />
        <Route path="/likes" element={<LikedVideoPage />} />
        <Route path="/playlist/:id" element={<PlaylistPage />} />
        <Route path="/trends" element={<TrendsPage />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<FullVideoLayout />}>
        <Route path="/videos/:id" element={<FullVideoPage />} />
      </Route>
    </Routes>
  );
};
