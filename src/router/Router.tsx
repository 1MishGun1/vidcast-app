import { Routes, Route } from "react-router-dom";
import { Layout } from "../components/Layout/Layout";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
    </Routes>
  );
};
