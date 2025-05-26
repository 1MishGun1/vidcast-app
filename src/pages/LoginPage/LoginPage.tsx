import { Link, Navigate } from "react-router-dom";
import Styles from "./LoginPage.module.css";
import { ILoginUser } from "../../models/user";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, selectIsAuth } from "../../features/auth/auth";
import { AppDispatch, RootState } from "../../store";

export const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const isAuth = useSelector(selectIsAuth);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<ILoginUser>({
    defaultValues: {
      login: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ILoginUser> = async (values) => {
    const data = await dispatch(fetchUserData(values));
    if (fetchUserData.fulfilled.match(data)) {
      const token = data.payload.tokenUser;
      window.localStorage.setItem("token", token);
    } else {
      console.error("Ошибка авторизации");
    }
  };

  if (isAuth) return <Navigate to={"/"} />;

  console.log(isAuth);

  return (
    <section className={Styles["login_page"]}>
      <img src="/img/1.jpg" alt="" className={Styles["login_img"]} />
      <div className={Styles["login_form_section"]}>
        <form
          className={Styles["form_login"]}
          onSubmit={handleSubmit(onSubmit)}
          data-theme={theme}
        >
          <h1 className={Styles["login_title"]}>Войти</h1>
          <div className={Styles["form_row"]}>
            <label htmlFor="login">Логин</label>
            <input
              type="text"
              id="login"
              className={Styles["form_input"]}
              {...register("login", { required: "Укажите логин" })}
              data-theme={theme}
            />
          </div>
          <div className={Styles["form_row"]}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              className={Styles["form_input"]}
              {...register("password", { required: "Укажите пароль" })}
              data-theme={theme}
            />
          </div>
          <button
            type="submit"
            className={Styles["form_btn"]}
            data-theme={theme}
          >
            Войти
          </button>
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
