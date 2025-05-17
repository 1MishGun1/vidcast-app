import { Outlet } from "react-router-dom";
import { SideBar } from "../SideBar/SideBar";
import { Header } from "../Header/Header";

export const Layout = () => {
  return (
    <>
      <SideBar />
      <main className="main">
        <Header />
        <div className="content__page">
          <Outlet />
        </div>
      </main>
    </>
  );
};
