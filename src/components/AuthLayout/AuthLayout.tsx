import { Outlet } from "react-router-dom";
import Styles from "./AuthLayout.module.css";

export const AuthLayout = () => {
  return (
    <main className={Styles["main"]}>
      <Outlet />
    </main>
  );
};
