import CommentForm from "./CommentForm";
import styles from './Comment.module.scss';
import classNames from 'classnames/bind';
import avatar from '~/assets/images/avatarDefault.jpg'
const cx = classNames.bind(styles);
const Comment = ({
  comment,
  replies,
  setActiveComment,
  activeComment,
  updateComment,
  deleteComment,
  addComment,
  // parentId ,
  currentUserId,
  getReplies,
  isAdmin
}) => {
  const isEditing =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "editing";
  const isReplying =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "replying";
  const canDelete =
    currentUserId === comment.user_id || isAdmin;
  const canReply = Boolean(currentUserId);
  const canEdit = currentUserId === comment.user_id ;
  const replyId =  comment.id;
  function formatTimeAgo(commentDate) {
    const commentTime = new Date(commentDate).getTime();
    const currentTime = new Date().getTime();
    const timeDifferenceInSeconds = Math.floor((currentTime - commentTime) / 1000);
  
    if (timeDifferenceInSeconds < 60) {
      return 'vài giây trước';
    } else if (timeDifferenceInSeconds < 3600) {
      const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);
      return `${minutesAgo} phút trước`;
    } else if (timeDifferenceInSeconds < 86400) {
      const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600);
      return `${hoursAgo} giờ trước`;
    } else if (timeDifferenceInSeconds < 604800) {
      const daysAgo = Math.floor(timeDifferenceInSeconds / 86400);
      return `${daysAgo} ngày trước`;
    } else {
      // Thời gian lớn hơn 7 ngày, hiển thị thời gian đầy đủ
      const createdAt = new Date(commentDate).toLocaleString(); // Định dạng thời gian đầy đủ
      return createdAt;
    }
  }
  const createdAt = formatTimeAgo(comment.date);

  return (
    <div key={ comment.id} className={cx('comment')} >
      <div className= {cx('comment-image-container')}>
        <img src={comment.img ? comment.img :avatar} alt="avatar comment"/>
      </div>
      
      <div className={cx('comment-right-part')}>
        <div className={cx('comment-content')}>
          <div className={cx('comment-author')}>{comment.name}</div>
          <div>{createdAt}</div>
        </div>
        {!isEditing && <div className={cx('comment-text')}>{comment.text}</div>}
        {isEditing && (
          <CommentForm
            submitLabel="Cập nhật"
            hasCancelButton
            initialText={comment.text}
            handleSubmit={(text) => updateComment(text, comment.id)}
            handleCancel={() => {
              setActiveComment(null);
            }}
          />
        )}
        <div className={cx('comment-actions')}>
          {canReply && (
            <div
              className={cx('comment-action')}
              onClick={() =>
                setActiveComment({ id: comment.id, type: "replying" })
              }
            >
              Trả lời
            </div>
          )}
          {canEdit && (
            <div
              className={cx('comment-action')}
              onClick={() =>
                setActiveComment({ id: comment.id, type: "editing" })
              }
            >
              Chỉnh sửa
            </div>
          )}
          {canDelete && (
            <div
              className={cx('comment-action')}
              onClick={() => deleteComment(comment.id)}
            >
              Xóa
            </div>
          )}
        </div>
        {isReplying && (
          <CommentForm
            submitLabel="Trả lời"
            handleSubmit={(text) => addComment(text, replyId)}
            hasCancelButton
            handleCancel={() => {
              setActiveComment(null);
            }}
          />
        )}
        {replies.length > 0 && (
          <div className= {cx('replies')}>
            {replies.map((reply) => (
              <Comment
                comment={reply}
                key={reply.id}
                setActiveComment={setActiveComment}
                activeComment={activeComment}
                updateComment={updateComment}
                deleteComment={deleteComment}
                addComment={addComment}
                // parentId={comment.id}
                replies={getReplies(reply.id)}
                currentUserId={currentUserId}
                getReplies = {getReplies}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
