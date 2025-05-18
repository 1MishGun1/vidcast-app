import { Outlet } from "react-router-dom";
import { SideBar } from "../SideBar/SideBar";
import { Header } from "../Header/Header";
import Styles from "./Layout.module.css";

export const Layout = () => {
  return (
    <div className={Styles["layout"]}>
      <SideBar />
      <section className={Styles["content"]}>
        <Header />
        <main className={Styles["main"]}>
          <Outlet />
        </main>
      </section>
    </div>
  );
};
