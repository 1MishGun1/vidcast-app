import Styles from "./CommentItem.module.css";
import { IComment } from "../../models/comment";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "../../features/comments/comments";
import { AppDispatch } from "../../store";
import { selectCurrentUser } from "../../features/auth/auth";
import no_avatar from "../../assets/no_avatar.png";
import { CommentForm } from "../CommentForm/CommentForm";
import { useState } from "react";

interface ICommentProps {
  comment: IComment;
  videoAuthorId: string;
}

export const CommentItem = ({ comment, videoAuthorId }: ICommentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(selectCurrentUser);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const isOwner = currentUser?._id === comment.user._id;
  const isVideoOwner = currentUser?._id === videoAuthorId;

  const handleDelete = () => {
    if (!currentUser?._id) return;
    if (window.confirm("Удалить комментарий?")) {
      dispatch(
        deleteComment({ commentId: comment._id, userId: currentUser?._id })
      );
    }
  };

  const handleReplyToggle = () => {
    setShowReplyForm((prev) => !prev);
  };

  return (
    <div className={Styles["comment_wrapper"]}>
      <div className={Styles["comment"]}>
        <img
          className={Styles["comment_user_avatar"]}
          src={
            comment.user.avatar
              ? `http://localhost:3333${comment.user.avatar}`
              : no_avatar
          }
          alt={`${comment.user.login}'s avatar`}
        />
        <div className={Styles["comment_user_login_text"]}>
          <p className={Styles["comment_user_login"]}>@{comment.user.login}</p>
          <p className={Styles["comment_text"]}>{comment.text}</p>
        </div>

        {(isOwner || isVideoOwner) && (
          <button onClick={handleDelete} className="comment_btn">
            Удалить
          </button>
        )}
      </div>

      {comment.replies.length > 0 && (
        <button
          onClick={() => setShowReplies((prev) => !prev)}
          className={Styles["toggle_replies_btn"]}
        >
          {showReplies
            ? `Скрыть ответы (${comment.replies.length})`
            : `Показать ответы (${comment.replies.length})`}
        </button>
      )}

      {showReplies && (
        <div className={Styles["comment_replies"]}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              videoAuthorId={videoAuthorId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
