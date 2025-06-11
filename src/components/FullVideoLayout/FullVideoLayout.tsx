import { Outlet } from "react-router-dom";
import { HeaderFullVideo } from "../HeaderFullVideo/HeaderFullVideo";
import Styles from "./FullVideoLayout.module.css";

export const FullVideoLayout = () => {
  return (
    <>
      <HeaderFullVideo />
      <main className={Styles["main"]}>
        <Outlet />
      </main>
    </>
  );
};
