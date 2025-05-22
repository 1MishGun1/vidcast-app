import { Link } from "react-router-dom";
import Styles from "./RegisterPage.module.css";

export const RegisterPage = () => {
  return (
    <section className={Styles["login_page"]}>
      <img src="/img/2.jpg" alt="" className={Styles["login_img"]} />
      <div className={Styles["login_form_section"]}>
        <form className={Styles["form_login"]}>
          <h1 className={Styles["login_title"]}>Регистрация</h1>
          <div className={Styles["form_row"]}>
            <label htmlFor="name">Имя</label>
            <input
              type="text"
              name="name"
              id="name"
              className={Styles["form_input"]}
            />
          </div>
          <div className={Styles["form_row"]}>
            <label htmlFor="surname">Фамилия</label>
            <input
              type="text"
              name="surname"
              id="surname"
              className={Styles["form_input"]}
            />
          </div>
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
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              id="email"
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
          <button className={Styles["form_btn"]}>Создать аккаунт</button>
          <div className={Styles["form_register"]}>
            <p className={Styles["form_question"]}>Есть аккаунт?</p>
            <Link to={"/login"} className={Styles["form_link_register"]}>
              Войдите в него!
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};
