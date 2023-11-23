import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '~/utils/api/axios';
// import { render } from '@testing-library/react';
import Swal from 'sweetalert2/dist/sweetalert2.js';
// import { useTokenStore } from '~/utils/store/token';
// import { useUserStore } from '~/utils/store/user';
import './login.component.scss';
import { Link } from 'react-router-dom';
import { loginStart, loginFailed, loginSuccess, addToCart, addToNotification } from '~/utils/store/authSlice';
import { useDispatch } from 'react-redux';
const LoginForm = (onClose) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    // const [setUserInfo] = useUserStore((state) => [state.setUserInfo]);
    // const [setToken] = useTokenStore((state) => [state.setToken]);
    const navigate = useNavigate();
    const dispath = useDispatch();

    const handlePhoneChange = (event) => {
        const newPhone = event.target.value;
        setPhone(newPhone);
        if (newPhone && errors.phone) {
            setErrors((errors) => ({ ...errors, phone: '' }));
        }
    };

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        if (newPassword && errors.password) {
            setErrors((errors) => ({ ...errors, password: '' }));
        }
    };

    const validateForm = () => {
        let formIsValid = true;

        if (!phone) {
            formIsValid = false;
            setErrors((errors) => ({ ...errors, phone: 'Vui lòng nhập số điện thoại!' }));
        } else {
            const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
            if (!regexPhoneNumber.test(phone)) {
                formIsValid = false;
                setErrors((errors) => ({ ...errors, phone: 'Vui lòng nhập số điện thoại hợp lệ!' }));
            } else {
                setErrors((errors) => ({ ...errors, phone: '' }));
            }
        }

        if (!password) {
            formIsValid = false;
            setErrors((errors) => ({ ...errors, password: 'Vui lòng nhập password!' }));
        } else {
            setErrors((errors) => ({ ...errors, password: '' }));
        }

        return formIsValid;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            dispath(loginStart());
            axios
                .post(
                    '/auth/login',
                    {
                        phone: phone,
                        password: password,
                    },
                    {
                        headers: {
                            'Content-type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        },
                    },
                )
                .then((response) => {
                    if (response.status === 200 || response.data.userId !== null) {
                        Swal.fire({
                            html: `<h4>Đăng nhập thành công!</h4>`,
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1100,
                        });

                        dispath(loginSuccess(response.data));

                        axios
                            .get(`/auth/cart/${response.data.id}`)
                            .then((res) => {
                                dispath(addToCart(res.data));
                            })
                            .catch((error) => console.log(error));
                        axios
                            .get(`/auth/notification/${response.data.id}`)
                            .then((res) => {
                                dispath(addToNotification(res.data));
                            })
                            .catch((error) => console.log(error));
                        navigate('/');
                    }
                })
                .catch((err) => {
                    if (err.response && err.response.status === 401) {
                        setErrors((errors) => ({ ...errors, password: 'Số điện thoại hoặc mật khẩu không đúng!' }));
                    } else {
                        console.log('error', err);
                    }
                    dispath(loginFailed());
                });
         
        }
    };
    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <div className="form-header">
                    <h3 className="form-heading">Đăng nhập</h3>
                </div>
                <div className="form-group">
                    <label className="form-label" htmlFor="form3Example3">
                        Số điện thoại
                    </label>

                    <input
                        type="text"
                        id="form3Example3"
                        className="form-control1"
                        placeholder="Nhập số điện thoại"
                        aria-describedby="phoneHelp"
                        value={phone}
                        onChange={handlePhoneChange}
                    />
                    {errors['phone'] !== '' && <span className="error">{errors['phone']}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="form3Example4">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        id="form3Example4"
                        className="form-control1"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={handlePasswordChange}
                    />

                    {errors['password'] !== '' && <span className="error">{errors['password']}</span>}
                </div>

                <div className="d-flex justify-content-end align-items-center">
                    <a href="#!" className="text-body">
                        <Link to={'/mail'}>Quên mật khẩu?</Link>
                    </a>
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                    <button type="submit" className="form-submit">
                        Đăng nhập
                    </button>
                    <p className="small fw-bold mt-2 pt-1 mb-0">
                        Chưa có tài khoản?{' '}
                        <a href="#!" className="link-danger">
                            <Link to={'/register'}>Đăng ký</Link>
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
};
export default LoginForm;
