import { useState } from 'react';
import styles from './Comment.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
const CommentForm = ({ handleSubmit, submitLabel, hasCancelButton = false, handleCancel, initialText = '' }) => {
    const [text, setText] = useState(initialText);
    const isTextareaDisabled = text.length === 0;
    const onSubmit = (event) => {
        event.preventDefault();
        handleSubmit(text);
        setText('');
    };
    const handleKeyDown = (event) => {
        if (event.keyCode === 13 && !event.shiftKey) {
            // Check if Enter key is pressed without Shift key
            event.preventDefault();
            onSubmit(event);
        }
    };
    return (
        <form onSubmit={onSubmit}>
            <textarea
                className={cx('comment-form-textarea')}
                placeholder="Viết bình luận"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button className={cx('comment-form-button')} disabled={isTextareaDisabled}>
                {submitLabel}
            </button>
            {hasCancelButton && (
                <button
                    type="button"
                    className={cx('comment-form-button', 'comment-form-cancel-button')}
                    onClick={handleCancel}
                >
                    Hủy
                </button>
            )}
        </form>
    );
};

export default CommentForm;
