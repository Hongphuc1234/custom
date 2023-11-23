import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registerForm.scss';
import Swal from 'sweetalert2';
import axios from '~/utils/api/axios';
import { ToastContainer, toast } from 'react-toastify';

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [birthday, setBirthday] = useState('');
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        const { id, value } = e.target;

        if (id === 'name') {
            setUsername(value);
            setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
        }
        if (id === 'phone') {
            setPhone(value);
        }
        if (id === 'email') {
            setEmail(value);
        }
        if (id === 'password') {
            setPassword(value);
        }
        if (id === 'confirmPassword') {
            setConfirmPassword(value);
        }
        if (id === 'birthday') {
            setBirthday(value);
        }

        if (value !== '') {
            setErrors((errors) => ({ ...errors, [id]: '' }));
        }
    };

    const validateForm = () => {
        let formIsValid = true;
        if (!username) {
            formIsValid = false;
            setErrors((errors) => ({ ...errors, username: 'Vui lòng nhập tên !' }));
        } else {
            setErrors((errors) => ({ ...errors, username: '' }));
        }

        if (!email) {
            formIsValid = false;
            setErrors((errors) => ({ ...errors, email: 'Vui lòng nhập email!' }));
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formIsValid = false;
                setErrors((errors) => ({ ...errors, email: 'Vui lòng nhập email hợp lệ!' }));
            } else {
                setErrors((errors) => ({ ...errors, email: '' }));
            }
        }
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
        if (!birthday) {
            formIsValid = false;
            setErrors((errors) => ({ ...errors, birthday: 'Vui lòng nhập ngày sinh!' }));
        } else {
            const currentDate = new Date();
            const selectedDate = new Date(birthday);

            if (selectedDate >= currentDate) {
                formIsValid = false;
                setErrors((errors) => ({ ...errors, birthday: 'Ngày sinh phải nhỏ hơn ngày hiện tại!' }));
            } else {
                setErrors((errors) => ({ ...errors, birthday: '' }));
            }
        }
        if (!password) {
            formIsValid = false;
            setErrors((errors) => ({ ...errors, password: 'Vui lòng nhập mật khẩu!' }));
        } else {
            // Kiểm tra mật khẩu có ít nhất 8 ký tự, bao gồm chữ viết hoa, chữ viết thường và số
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                formIsValid = false;
                setErrors((errors) => ({
                    ...errors,
                    password: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ viết hoa, chữ viết thường và số!',
                }));
            } else {
                setErrors((errors) => ({ ...errors, password: '' }));
            }
        }
        if (!confirmPassword) {
            formIsValid = false;
            setErrors((errors) => ({ ...errors, confirmPassword: 'vui lòng nhập lại mật khẩu !' }));
        } else {
            if (confirmPassword !== password) {
                formIsValid = false;
                setErrors((errors) => ({ ...errors, confirmPassword: 'Mật khẩu nhập lại không đúng !' }));
            } else {
                setErrors((errors) => ({ ...errors, confirmPassword: '' }));
            }
        }

        return formIsValid;
    };
    const [Btn, setBtn] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log(email);
            setBtn(true);
            Swal.fire({
                html: `<h4>OTP đã được gửi tới email của bạn !</h4>`,
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
            });
            axios
                .post('/users/mail', {
                    otp: '12',
                    name: username,
                    birthday: birthday,
                    phone: phone,
                    pass: password,
                    email: email,
                })
                .then((response) => {
                    console.log(response.data);
                    toast.success('mã OTP đã được gửi đến gmail của bạn!');
                    if (response.data === 'Email is already existed' || response.data === 'Phone is already existed') {
                        if (response.data === 'Email is already existed') {
                            setErrors((errors) => ({ ...errors, email: 'Email đã tồn tại!' }));
                        }
                        if (response.data === 'Phone is already existed') {
                            setErrors((errors) => ({ ...errors, phone: 'Số điện thoại đã tồn tại!' }));
                        }
                    } else {
                        Swal.fire({
                            html: `<h4>Hãy nhập mã xác nhận gồm 4 chữ số được gửi đến:</h4>
                                    <h4 style="color: #4caf50 ; text-align:center">${email}</h4>`,
                            input: 'number',
                            showCancelButton: true,
                            confirmButtonText: 'Xác nhận',
                            cancelButtonText: 'Đóng',
                            showLoaderOnConfirm: true,
                            confirmButtonColor: '#4caf50',
                            cancelButtonColor: ' #D3D3D3',
                            allowOutsideClick: false,
                            preConfirm: (code) => {
                                return axios
                                    .post('/users/register', {
                                        otp: code,
                                        name: username,
                                        birthday: birthday,
                                        phone: phone,
                                        pass: password,
                                        email: email,
                                    })
                                    .then((res) => {
                                        console.log(res);
                                        if (res.data === 'OTP het han') {
                                            Swal.showValidationMessage('Mã OTP hết hạn! Vui lòng thử lại!');
                                            Swal.close();
                                            document.getElementById('f').innerText = `Mã OTP hết hạn`;
                                            document.getElementById('f').style.color = 'red';
                                        } else {
                                            if (res.data === 'OTP is not correct') {
                                                Swal.showValidationMessage('Mã OTP không đúng! Vui lòng thử lại!');
                                            } else {
                                                toast.success('Đăng kí thành công!');
                                                setTimeout(() => {
                                                    navigate('/login');
                                                }, 2000);
                                            }
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            },
                        });
                    }
                });
        }
    };
    return (
        <form className="form" id="form-1">
            <div className="form-header">
                <h3 className="form-heading">Đăng Ký</h3>
            </div>
            <p id="f"></p>
            <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="VD: Hoàng Hồng Phúc"
                    className="form-control1"
                    value={username}
                    onChange={(e) => handleInputChange(e)}
                />
                <i className="fa-solid fa-user form-user"></i>
                <span className="form-message"></span>
                {errors['username'] !== '' && <span className="error">{errors['username']}</span>}
            </div>

            <div className="form-group">
                <label className="form-label">Email</label>
                <input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="VD: phuc@gmail.com"
                    className="form-control1"
                    value={email}
                    onChange={(e) => handleInputChange(e)}
                />
                <i className="fa-solid fa-user form-user"></i>
                <span className="form-message"></span>
                {errors['email'] !== '' && <span className="error">{errors['email']}</span>}
            </div>

            <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="VD: 0720743823"
                    className="form-control1"
                    value={phone}
                    onChange={(e) => handleInputChange(e)}
                />
                <i className="fa-solid fa-user form-user"></i>
                <span className="form-message"></span>
                {errors['phone'] !== '' && <span className="error">{errors['phone']}</span>}
            </div>
            <div className="form-group">
                <label className="form-label">Ngày sinh</label>
                <input
                    id="birthday"
                    name="birthday"
                    type="date"
                    placeholder="Nhập mật khẩu"
                    className="form-control1"
                    value={birthday}
                    onChange={(e) => handleInputChange(e)}
                />
                <i className="fa-solid fa-user form-user"></i>
                <span className="form-message"></span>
                {errors['birthday'] !== '' && <span className="error">{errors['birthday']}</span>}
            </div>

            <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="form-control1"
                    value={password}
                    onChange={(e) => handleInputChange(e)}
                />
                <i className="fa-solid fa-user-lock form-lock"></i>
                <span className="form-message"></span>
                <i className="fa-solid fa-eye-slash form-eye-slash"></i>
                {errors['password'] !== '' && <span className="error">{errors['password']}</span>}
            </div>

            <div className="form-group">
                <label className="form-label">Nhập lại mật khẩu</label>
                <input
                    id="confirmPassword"
                    name="password_confirmation"
                    placeholder="Nhập lại mật khẩu"
                    type="password"
                    className="form-control1"
                    value={confirmPassword}
                    onChange={(e) => handleInputChange(e)}
                />
                <i className="fa-solid fa-user-lock form-lock"></i>
                <span className="form-message"></span>
                <i className="fa-solid fa-eye-slash form-eye-slash"></i>
                {errors['confirmPassword'] !== '' && <span className="error">{errors['confirmPassword']}</span>}
            </div>

            <button disabled={Btn} className="form-submit" onClick={(e) => handleSubmit(e)} type="submit">
                Đăng ký
            </button>
        </form>
    );
}
export default RegisterForm;
