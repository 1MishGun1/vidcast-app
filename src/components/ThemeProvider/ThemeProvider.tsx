import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setTheme } from "../../features/theme/theme";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  useEffect(() => {
    const saveTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saveTheme) {
      dispatch(setTheme(saveTheme));
    }
  }, [dispatch]);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return <>{children}</>;
};
