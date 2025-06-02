import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../../features/comments/comments";
import { selectCurrentUser } from "../../features/auth/auth";
import { AppDispatch, RootState } from "../../store";
import Styles from "./CommentForm.module.css";

interface ICommentForm {
  videoId: string;
}

export const CommentForm = ({ videoId }: ICommentForm) => {
  const [text, setText] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectCurrentUser);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(createComment({ videoId, text }));
      setText("");
    }
  };

  return (
    <form className={Styles["comment_form"]} onClick={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введите комментарий"
        className={Styles["comment_input"]}
      />
      <button type="submit" className={Styles["comment_btn"]}>
        Комментировать
      </button>
    </form>
  );
};
