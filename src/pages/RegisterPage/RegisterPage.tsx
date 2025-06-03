import { Link, Navigate } from "react-router-dom";
import Styles from "./RegisterPage.module.css";
import { IRegisterUser } from "../../models/user";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserRegister, selectIsAuth } from "../../features/auth/auth";
import { AppDispatch, RootState } from "../../store";
import axios from "../../api/config";

export const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const isAuth = useSelector(selectIsAuth);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isValid },
  } = useForm<IRegisterUser>({
    defaultValues: {
      name: "",
      surname: "",
      login: "",
      email: "",
      password: "",
      avatar: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IRegisterUser> = async (values) => {
    const data = await dispatch(fetchUserRegister(values));
    if (fetchUserRegister.fulfilled.match(data)) {
      const token = data.payload.tokenUser;
      window.localStorage.setItem("token", token);
    } else {
      setError("root", {
        type: "manual",
        message: "Неверный логин или пароль",
      });
      console.error("Ошибка регистрации");
    }
  };

  if (isAuth) return <Navigate to={"/"} />;

  const handleChangeFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const formData = new FormData();
      const file = event.target.files?.[0];

      if (!file) return;

      formData.append("avatar", file);
      const { data } = await axios.post("/uploads/avatars", formData);
      setValue("avatar", data.url);
    } catch (error) {
      console.error("Ошибка при загрузке аватарки", error);
    }
  };

  return (
    <section className={Styles["login_page"]}>
      <img src="/img/2.jpg" alt="" className={Styles["login_img"]} />
      <div className={Styles["login_form_section"]}>
        {errors.root && (
          <div className={Styles["form_error"]}>{errors.root.message}</div>
        )}
        <form
          className={Styles["form_login"]}
          onSubmit={handleSubmit(onSubmit)}
          data-theme={theme}
        >
          <h1 className={Styles["login_title"]}>Регистрация</h1>
          <div className={Styles["form_row"]}>
            <label htmlFor="name">Имя</label>
            <input
              type="text"
              id="name"
              className={Styles["form_input"]}
              {...register("name", {
                required: "Укажите имя",
                minLength: {
                  value: 1,
                  message: "Укажите имя",
                },
              })}
              data-theme={theme}
            />
            {errors.name && (
              <span className={Styles["error_message"]}>
                {errors.name.message}
              </span>
            )}
          </div>
          <div className={Styles["form_row"]}>
            <label htmlFor="surname">Фамилия</label>
            <input
              type="text"
              id="surname"
              className={Styles["form_input"]}
              {...register("surname", {
                required: "Укажите фамилию",
                minLength: {
                  value: 1,
                  message: "Укажите фамилию",
                },
              })}
              data-theme={theme}
            />
            {errors.surname && (
              <span className={Styles["error_message"]}>
                {errors.surname.message}
              </span>
            )}
          </div>
          <div className={Styles["form_row"]}>
            <label htmlFor="login">Логин</label>
            <input
              type="text"
              id="login"
              className={Styles["form_input"]}
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
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              className={Styles["form_input"]}
              {...register("email", {
                required: "Укажите email",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Некорректный email",
                },
              })}
              data-theme={theme}
            />
            {errors.email && (
              <span className={Styles["error_message"]}>
                {errors.email.message}
              </span>
            )}
          </div>
          <div className={Styles["form_row"]}>
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              className={Styles["form_input"]}
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
          <div className={Styles["form_row"]}>
            <label htmlFor="avatar">Аватарка (необязательно)</label>
            <input
              type="file"
              id="avatar"
              className={Styles["form_input"]}
              data-theme={theme}
              onChange={handleChangeFile}
              accept="image/jpeg, image/png, image/gif"
            />
            {errors.avatar && (
              <span className={Styles["error_message"]}>
                {errors.avatar.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={!isValid}
            className={Styles["form_btn"]}
            data-theme={theme}
          >
            Создать аккаунт
          </button>
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
