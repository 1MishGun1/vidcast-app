import { Link } from "react-router-dom";
import Styles from "./LoginPage.module.css";

export const LoginPage = () => {
  return (
    <section className={Styles["login_page"]}>
      <img src="/img/1.jpg" alt="" className={Styles["login_img"]} />
      <div className={Styles["login_form_section"]}>
          <form className={Styles["form_login"]}>
            <h1 className={Styles["login_title"]}>Войти</h1>
            <div className={Styles["form_row"]}>
              <label htmlFor="login">Логин</label>
              <input
                type="text"
                name="login"
                id="login"
                className={Styles["form_input"]}
              />
            </div>
            <div className={Styles["form_row"]}>
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                name="password"
                id="password"
                className={Styles["form_input"]}
              />
            </div>
            <button className={Styles["form_btn"]}>Войти</button>
            <div className={Styles["form_register"]}>
              <p className={Styles["form_question"]}>Нет аккаунта?</p>
              <Link to={"/register"} className={Styles["form_link_register"]}>
                Создайте его!
              </Link>
            </div>
          </form>
      </div>
    </section>
  );
};
