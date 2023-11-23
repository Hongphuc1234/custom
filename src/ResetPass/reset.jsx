import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '~/utils/api/axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import './reset.scss';

const ResetForm = () => {
    const user = useSelector((state) => state.auth.login?.currenUser);
    const [resetpass, setResetpass] = useState('');
    const [oldpass, setOldpass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [errors, setErrors] = useState({});
    const negative = useNavigate();

    useEffect(() => {
        if (!user) {
            Swal.fire({
                html: `<h4>Vui lòng đăng nhập!</h4>`,
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
            });
            negative('/login');
        }
    });
    const validation = () => {
        let formIsValid = true;
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!oldpass) {
            formIsValid = false;
            setErrors((errors) => ({ ...errors, oldpass: 'Vui lòng nhập mật khẩu cũ' }));
        } else {
            setErrors((errors) => ({ ...errors, oldpass: '' }));
        }

        if (!resetpass) {
            formIsValid = false;
            setErrors((errors) => ({ ...errors, resetpass: 'Vui lòng nhập mật khẩu mới' }));
        } else if (!strongPasswordRegex.test(resetpass)) {
            formIsValid = false;
            setErrors((errors) => ({
                ...errors,
                resetpass: 'Mật khẩu mới phải ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường và số',
            }));
        } else {
            setErrors((errors) => ({ ...errors, resetpass: '' }));
        }

        if (!confirmPass) {
            formIsValid = false;
            setErrors((errors) => ({ ...errors, confirmPass: 'Vui lòng nhập lại mật khẩu mới' }));
        } else if (resetpass !== confirmPass) {
            formIsValid = false;
            setErrors((errors) => ({ ...errors, confirmPass: 'Mật khẩu nhập lại không khớp' }));
        } else {
            setErrors((errors) => ({ ...errors, confirmPass: '' }));
        }
        return formIsValid;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validation()) {
            axios
                .post('/users/newpass', {
                    id: user.id,
                    oldPass: oldpass,
                    newPass: resetpass,
                })
                .then((res) => {
                    console.log('ssssss');
                    console.log(res.data);
                    if (res.data === 'suscess') {
                        Swal.fire({
                            html: `<h4>Đổi mật khẩu thành công!</h4>`,
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1100,
                        });
                        negative('/login');
                    } else {
                        document.getElementById('f').innerText = 'Wrong old password';
                    }
                });
        }
    };
    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <div className="divider d-flex align-items-center my-4">
                    <p className="text-center fw-bold mx-3 mb-0 title-lable">Đổi mật khẩu</p>
                </div>
                <p id="f" style={{ color: 'red' }}></p>

                <div className="form-outline mb-4">
                    <label className="label title-lable" htmlFor="form3Example3">
                        Nhập mật khẩu cũ
                    </label>

                    <input
                        type="password"
                        id="form3Example3"
                        className="form-control form-control-lg black-border"
                        placeholder="Nhập mật khẩu mới"
                        aria-describedby="phoneHelp"
                        value={oldpass}
                        onChange={(event) => setOldpass(event.target.value)}
                    />
                    {errors['oldpass'] !== '' && <span className="error">{errors['oldpass']}</span>}
                </div>

                <div className="form-outline mb-4">
                    <label className="label title-lable" htmlFor="form3Example3">
                        Nhập mật khẩu mới
                    </label>

                    <input
                        type="password"
                        id="form3Example3"
                        className="form-control form-control-lg black-border"
                        placeholder="Nhập mật khẩu mới"
                        aria-describedby="phoneHelp"
                        value={resetpass}
                        onChange={(event) => setResetpass(event.target.value)}
                    />
                    {errors['resetpass'] !== '' && <span className="error">{errors['resetpass']}</span>}
                </div>

                <div className="form-outline mb-3">
                    <label className="label title-lable" htmlFor="form3Example4">
                        Nhập lại mật khẩu mới
                    </label>
                    <input
                        type="password"
                        id="form3Example4"
                        className="form-control form-control-lg black-border"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPass}
                        onChange={(event) => setConfirmPass(event.target.value)}
                    />

                    {errors['confirmPass'] !== '' && <span className="error">{errors['confirmPass']}</span>}
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                    <button type="submit" className="form-submit">
                        Xác nhận
                    </button>
                </div>
            </form>
        </div>
    );
};
export default ResetForm;
