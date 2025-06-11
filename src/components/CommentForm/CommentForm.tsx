import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../../features/comments/comments";
import { selectCurrentUser } from "../../features/auth/auth";
import { AppDispatch, RootState } from "../../store";
import Styles from "./CommentForm.module.css";
import { IComment } from "../../models/comment";

interface ICommentForm {
  videoId: string;
  parentComment?: IComment | null;
  onCancelReply?: () => void;
}

export const CommentForm = ({
  videoId,
  parentComment = null,
  onCancelReply,
}: ICommentForm) => {
  const [text, setText] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectCurrentUser);
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(
        createComment({
          text,
          videoId,
          parentCommentId: parentComment?._id ?? null,
        })
      );
      setText("");

      // Закрыть форму ответа (если это ответ)
      if (parentComment && onCancelReply) {
        onCancelReply();
      }
    }
  };

  return (
    <form className={Styles["comment_form"]} onClick={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          parentComment ? "Введите ответ..." : "Введите комментарий..."
        }
        className={Styles["comment_input"]}
        data-theme={theme}
      />
      <button
        type="submit"
        className={Styles["comment_btn"]}
        data-theme={theme}
      >
        {parentComment ? "Ответить" : "Комментировать"}
      </button>

      {parentComment && onCancelReply && (
        <button
          type="button"
          onClick={onCancelReply}
          className={Styles["comment_btn"]}
          data-theme={theme}
        >
          Отмена
        </button>
      )}
    </form>
  );
};
