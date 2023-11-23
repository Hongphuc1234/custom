import { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import styles from './Comment.module.scss';
import classNames from 'classnames/bind';
import { BASE_URL } from '~/utils/api/axios';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import axios from '~/utils/api/axios';
import ConfirmBox from '~/pages/Admin/components/ConfirmBox';
import isAdmin from '~/utils/jwt';
const cx = classNames.bind(styles);
let badword = /ngu|cc|cac|fuck|c/gi;
const Comments = ({ serviceID }) => {
    const [open, setOpen] = useState(false);
    const [deleteData, setDeleteData] = useState(null);
    const user = useSelector((state) => state.auth.login?.currenUser);
    const [stompClient, setStompClient] = useState(null);
    const [backendComments, setBackendComments] = useState([]);
    const [activeComment, setActiveComment] = useState(null);
    const rootComments = backendComments.filter((backendComment) => backendComment.parentID === 0);
    const isAdminCheck = isAdmin(user?.accessToken);
    const getReplies = (commentId) =>
        backendComments
            .filter((backendComment) => backendComment.parentID === commentId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const addComment = (text, parentId) => {
        if (user) {
            const comment = {
                text: text.replace(badword, '♥️'),
                parentID: parentId ? parentId : 0,
                user_id: user.id,
                service_id: serviceID,
                date: new Date(),
                id: null,
            };
            stompClient.send(`/app/comment/${serviceID}`, {}, JSON.stringify(comment));
        } else {
            toast.warning('Bạn chưa đăng nhập!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
        }
    };

    const updateComment = (text, commentId) => {
        if (user) {
            const updatedComment = {
                text: text,
                id: commentId,
                user_id: user.id,
                service_id: serviceID,
                date: new Date(),
                parentID: 0,
            };
            stompClient.send(`/app/updateComment/${serviceID}`, {}, JSON.stringify(updatedComment));
        } else {
            toast.warning('Bạn chưa đăng nhập!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
        }
    };
    const deleteWs = () => {
        if (user) {
            const updatedComment = {
                text: null,
                id: deleteData,
                user_id: user.id,
                service_id: serviceID,
                date: null,
                parentID: isAdmin ? 1 : 0,
            };
            stompClient.send(`/app/deleteComment/${serviceID}`, {}, JSON.stringify(updatedComment));
        } else {
            toast.warning('Bạn chưa đăng nhập!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
        }
    };
    const deleteComment = (commentId) => {
        setOpen(true);
        setDeleteData(commentId);
    };

    useEffect(() => {
        axios
            .get(`/comment/${serviceID}`)
            .then((res) => {
                const comment = res.data;
                setBackendComments(comment);
            })
            .catch((error) => console.log(error));
    }, [serviceID]);

    useEffect(() => {
        const socket = new SockJS(BASE_URL + '/ws');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            client.subscribe(`/topic/comment/${serviceID}`, (dataGot) => {
                setBackendComments((oldComment) => [JSON.parse(dataGot.body), ...oldComment]);
                setActiveComment(null);
            });
            client.subscribe(`/topic/updateComment/${serviceID}`, (dataGot) => {
                const updatedComment = JSON.parse(dataGot.body);

                setBackendComments((prevState) => {
                    // Find the index of the comment in the previous state
                    const commentIndex = prevState.findIndex(
                        (backendComment) => backendComment.id === updatedComment.id,
                    );

                    // If the comment is found in the previous state, update its text
                    if (commentIndex !== -1) {
                        const updatedBackendComments = [...prevState];
                        updatedBackendComments[commentIndex].text = updatedComment.text;
                        setActiveComment(null);
                        return updatedBackendComments;
                    }

                    // If the comment is not found in the previous state, return the previous state unchanged
                    return prevState;
                });
            });
            client.subscribe(`/topic/deleteComment/${serviceID}`, (dataGot) => {
                const deletedCommentId = JSON.parse(dataGot.body);
                setBackendComments((prevState) => {
                    // Filter out the deleted comment from the previous state
                    const updatedBackendComments = prevState.filter(
                        (backendComment) => backendComment.id !== deletedCommentId,
                    );
                    setOpen(false);
                    setActiveComment(null);
                    return updatedBackendComments;
                });
            });
            setStompClient(client);
        });

        return () => {
            client.disconnect();
        };
    }, [serviceID]);

    return (
        <>
            <div className={cx('comments')}>
                <h3 className={cx('comments-title')}>Bình luận</h3>
                {/* <div className={cx('comment-form-title')}>Viết bình luận</div> */}
                <CommentForm submitLabel="Bình luận" handleSubmit={addComment} />
                <div className={cx('comments-container')}>
                    {rootComments.map((rootComment) => (
                        <Comment
                            key={rootComment.id}
                            comment={rootComment}
                            replies={getReplies(rootComment.id)}
                            activeComment={activeComment}
                            setActiveComment={setActiveComment}
                            addComment={addComment}
                            deleteComment={deleteComment}
                            updateComment={updateComment}
                            currentUserId={user?.id}
                            getReplies={getReplies}
                            isAdmin={isAdminCheck}
                        />
                    ))}
                </div>
            </div>
            <ConfirmBox
                open={open}
                closeDialog={() => setOpen(false)}
                title={'Bạn có chắc muốn xóa bình luận!'}
                deleteFunction={deleteWs}
            />
            <ToastContainer />
        </>
    );
};

export default Comments;
