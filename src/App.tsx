import { useDispatch } from "react-redux";
import { AppDispatch } from "../src/store";
import { fetchAuthMe } from "./features/auth/auth";
import { Router } from "./router/Router";
import { useEffect } from "react";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return (
    <>
      <Router />
    </>
  );
};

export default App;
