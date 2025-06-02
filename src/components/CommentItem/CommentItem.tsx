import Styles from "./CommentItem.module.css";
import { IComment } from "../../models/comment";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment } from "../../features/comments/comments";
import { AppDispatch } from "../../store";
import { selectCurrentUser } from "../../features/auth/auth";
import no_avatar from "../../assets/no_avatar.png";

interface ICommentProps {
  comment: IComment;
  videoAuthorId: string;
}

export const CommentItem = ({ comment, videoAuthorId }: ICommentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(selectCurrentUser);

  const isOwner = currentUser?._id === comment.user._id;
  const isVideoOwner = currentUser?._id === videoAuthorId;

  const handleDelete = () => {
    if (window.confirm("Удалить комментарий?")) {
      dispatch(deleteComment(comment._id));
    }
  };

  return (
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

      <div className={Styles["comment_replies"]}>
        {comment.replies.map((reply) => (
          <CommentItem
            key={reply._id}
            comment={reply}
            videoAuthorId={videoAuthorId}
          />
        ))}
      </div>
    </div>
  );
};
