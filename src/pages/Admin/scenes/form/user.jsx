import { Box, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { Formik } from 'formik';
import axios from '~/utils/api/axios';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from '../../components/Header';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
// import { useState, useEffect } from 'react';

const Form = () => {
    const isNonMobile = useMediaQuery('(min-width:600px)');

    const handleFormSubmit = (values, { resetForm }) => {
        const formValues = {
            otp: null,
            name: values.name,
            birthday: values.date,
            phone: values.phone,
            pass: values.password,
            email: values.email,
        };
        axios
            .post(`/auth/register`, formValues)
            .then((res) => {
                switch (res.data) {
                    case 'phone':
                        toast.warning('Số điện thoại đã tồn tại!', {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'light',
                        });
                        break;
                    case 'email':
                        toast.warning('Email đã tồn tại!', {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'light',
                        });
                        break;
                    default:
                        resetForm();
                        toast.success('Tạo người dùng thành công!', {
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
            })
            .catch((error) => console.log(error));
    };
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    return (
        <>
            <Box m="20px">
                <Header title="Tạo người dùng" />

                <Formik onSubmit={handleFormSubmit} initialValues={initialValues} validationSchema={checkoutSchema}>
                    {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                                display="grid"
                                gap="30px"
                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                sx={{
                                    '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Tên"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    name="name"
                                    error={!!touched.name && !!errors.name}
                                    helperText={touched.name && errors.name}
                                    sx={{ gridColumn: 'span 4' }}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={!!touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                    sx={{ gridColumn: 'span 4' }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Số điện thoại"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.phone}
                                    name="phone"
                                    error={!!touched.phone && !!errors.phone}
                                    helperText={touched.phone && errors.phone}
                                    sx={{ gridColumn: 'span 4' }}
                                />
                                <TextField
                                    // fullWidth
                                    variant="filled"
                                    type="date"
                                    label="Ngày sinh"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    // value={values.date}
                                    name="date"
                                    error={!!touched.date && !!errors.date}
                                    helperText={touched.date && errors.date}
                                    sx={{ gridColumn: 'span 4', width: '200px' }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type={showPassword ? 'text' : 'password'}
                                    label="Mật khẩu"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    // value={values.date}
                                    name="password"
                                    error={!!touched.password && !!errors.password}
                                    helperText={touched.password && errors.password}
                                    sx={{ gridColumn: 'span 4' }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {' '}
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type={showPassword ? 'text' : 'password'}
                                    label="Nhập lại mật khẩu"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    // value={values.date}
                                    name="passwordConfirm"
                                    error={!!touched.passwordConfirm && !!errors.passwordConfirm}
                                    helperText={touched.passwordConfirm && errors.passwordConfirm}
                                    sx={{ gridColumn: 'span 4' }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {' '}
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Tạo người dùng
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
            <ToastContainer />
        </>
    );
};

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
    name: yup.string().required('Không được bỏ trống'),
    email: yup.string().email('Sai định dạng email').required('Không được bỏ trống'),
    phone: yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ').required('Không được bỏ trống'),
    date: yup
        .date()
        .max(new Date(), 'Không được chọn quá ngày hôm nay')
        .min('01/01/1923', 'ngày không hợp lệ')
        .required('Không được bỏ trống'),
    password: yup.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').required('Vui lòng nhập mật khẩu'),
    passwordConfirm: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Xác nhận mật khẩu phải khớp với mật khẩu')
        .required('Vui lòng nhập lại mật khẩu'),
});
const initialValues = {
    name: '',
    date: '',
    email: '',
    phone: '',
    passwordConfirm: '',
    password: '',
};

export default Form;
