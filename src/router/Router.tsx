import { Routes, Route } from "react-router-dom";
import { Layout } from "../components/Layout/Layout";
import { HomePage } from "../pages/HomePage";
import { FullVideoPage } from "../pages/FullVideoPage/FullVideoPage";
import { AuthLayout } from "../components/AuthLayout/AuthLayout";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { RegisterPage } from "../pages/RegisterPage/RegisterPage";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/videos/:id" element={<FullVideoPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
};
