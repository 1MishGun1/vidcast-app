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
      setError("root", {
        type: "manual",
        message: "Неверный логин или пароль",
      });
      console.error("Ошибка авторизации");
    }
  };

  if (isAuth) return <Navigate to={"/"} />;

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

          {errors.root && (
            <div className={Styles["form_error"]}>{errors.root.message}</div>
          )}

          <div className={Styles["form_row"]}>
            <label htmlFor="login">Логин</label>
            <input
              type="text"
              id="login"
              className={`${Styles["form_input"]} ${
                errors.login ? Styles["input_error"] : ""
              }`}
              {...register("login", {
                required: "Укажите логин",
                maxLength: {
                  value: 20,
                  message: "Логин должен быть не длиннее 20 символов",
                },
              })}
              data-theme={theme}
            />
            {errors.login && (
              <span className={Styles["error_message"]}>
                {errors.login.message}
              </span>
            )}
          </div>

          <div className={Styles["form_row"]}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              className={`${Styles["form_input"]} ${
                errors.password ? Styles["input_error"] : ""
              }`}
              {...register("password", {
                required: "Укажите пароль",
                minLength: {
                  value: 6,
                  message: "Пароль должен содержать минимум 6 символов",
                },
              })}
              data-theme={theme}
            />
            {errors.password && (
              <span className={Styles["error_message"]}>
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={Styles["form_btn"]}
            data-theme={theme}
            disabled={!isValid}
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
