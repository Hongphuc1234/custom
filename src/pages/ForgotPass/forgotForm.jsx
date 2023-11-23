import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '~/utils/api/axios';
import { useEmailStore } from '~/utils/store/email';
import './forgotForm.scss';

const ForgotForm = () => {
    const [email] = useEmailStore((state) => [state.email]);
    const [resetpass, setResetpass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [errors, setErrors] = useState({});
    const negative = useNavigate();

    const validation = () => {
        let formIsValid = true;
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!resetpass) {
            formIsValid = false;
            setErrors((errors) => ({ ...errors, resetpass: 'Vui lòng nhập mật khẩu mới' }));
        } else if (!strongPasswordRegex.test(resetpass)) {
            formIsValid = false;
            setErrors((errors) => ({
                ...errors,
                resetpass: 'Mật khẩu mới phải ít nhất 8 kí tự, bao gồm chữ hoa, chữ thường và số',
            }));
        }

        if (!confirmPass) {
            formIsValid = false;
            setErrors((errors) => ({ ...errors, confirmPass: 'Vui lòng nhập lại mật khẩu mới' }));
        } else if (resetpass !== confirmPass) {
            formIsValid = false;
            setErrors((errors) => ({ ...errors, confirmPass: 'Mật khẩu nhập lại không khớp' }));
        }
        return formIsValid;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validation()) {
            axios
                .post('/users/resetpass', {
                    email: email,
                    otp: resetpass,
                })
                .then((res) => {
                    console.log('ssssss');
                    console.log(res.data);
                    if (res.data === 'suscess') {
                        negative('/login');
                    }
                });
        }
    };
    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <div className="divider d-flex align-items-center my-4">
                    <p className="text-center fw-bold mx-3 mb-0 title-lable">Đổi lại mật khẩu</p>
                </div>
                <p id="f"></p>
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
export default ForgotForm;
