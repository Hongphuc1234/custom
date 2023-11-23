import { Box, Button, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from '~/utils/api/axios';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginStart, loginFailed, loginSuccess } from '~/utils/store/authSlice';
import { useDispatch } from 'react-redux';
import avatarDefault from '~/assets/images/avatarDefault.jpg';
import './Profile.scss';

function Profile() {
    const user = useSelector((state) => state.auth.login?.currenUser);
    const [isEditProfile, setIsEditProfile] = useState(false);
    const [isEditImg, setIsEditImg] = useState(false);
    const dispath = useDispatch();
    function isImageFile(file) {
        const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const acceptedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

        // Check MIME type
        if (acceptedImageTypes.includes(file.type)) {
            return true;
        }

        // Check file extension
        const fileName = file.name;
        const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
        if (acceptedExtensions.includes(fileExtension)) {
            return true;
        }

        return false;
    }

    const [imageBase64, setImageBase64] = useState('');

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (isImageFile(file)) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64String = reader.result;
                setImageBase64(base64String);
            };

            reader.readAsDataURL(file);
        } else {
            setImageBase64('');
            toast.warning('Đây không phải là ảnh!', {
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
    }

    const handleSubmitImg = () => {
        if (imageBase64) {
            dispath(loginStart());
            const values = {
                phone: user.phone,
                name: null,
                accessToken: user.accessToken,
                birthday: null,
                email: null,
                img: imageBase64,
            };
            axios
                .put(`/auth/updateImg`, values)
                .then((res) => {
                    if (res.status === 200) {
                        dispath(loginSuccess(res.data));
                        toast.success('Cập nhật ảnh thành công!', {
                            position: 'top-right',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: 'light',
                        });
                        setIsEditImg(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    dispath(loginFailed());
                });
        } else {
            toast.warning('Vui lòng chọn ảnh!', {
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

    const handleFormSubmitProfile = (values) => {
        dispath(loginStart());
        axios
            .put(`/auth/update`, values)
            .then((res) => {
                if (res.status === 200) {
                    dispath(loginSuccess(res.data));
                    toast.success('Cập nhật thông tin thành công!', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });
                    setIsEditProfile(false);
                }
            })
            .catch((error) => {
                console.log(error);
                dispath(loginFailed());
            });
    };

    return (
        <>
            {!user ? (
                <h1>Không có data</h1>
            ) : (
                <div className="container" style={{ marginTop: '20px' }}>
                    <div className="row">
                        <div className="col-lg-12 mb-4 mb-sm-5">
                            <div className="card card-style1 border-0">
                                <div className="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
                                    <div className="row align-items-center">
                                        <div className="col-lg-6 mb-4 mb-lg-0">
                                            <img
                                                src={
                                                    isEditImg && imageBase64
                                                        ? imageBase64
                                                        : user.img
                                                        ? user.img
                                                        : avatarDefault
                                                }
                                                alt="avatar"
                                                style={{ width: '400px', height: '400px', borderRadius: '13px' }}
                                            />
                                        </div>
                                        <div className="col-lg-6 px-xl-10">
                                            <div className="mb-2 d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
                                                <h3 className="h2  mb-0">{user.name}</h3>
                                            </div>
                                            <ul className="list-unstyled mb-1-9">
                                                <li className="mb-2 mb-xl-3 display-28">
                                                    <span className=" text-secondary me-2 font-weight-600">
                                                        Ngày sinh:
                                                    </span>{' '}
                                                    {user.birthday}
                                                </li>
                                                <li className="mb-2 mb-xl-3 ">
                                                    <span className=" text-secondary me-2 font-weight-600">Email:</span>{' '}
                                                    {user.email}
                                                </li>

                                                <li className="mb-2 mb-xl-3 ">
                                                    <span className=" text-secondary me-2 font-weight-600">
                                                        Số điện thoại:
                                                    </span>{' '}
                                                    {user.phone}
                                                </li>
                                            </ul>
                                            {!isEditProfile && !isEditImg && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        endIcon={<EditIcon />}
                                                        color="secondary"
                                                        size="large"
                                                        sx={{
                                                            fontFamily: 'Lora, serif',
                                                            backgroundColor: '#000',
                                                            color: '#fff',
                                                            fontWeight: 'bold',
                                                            fontSize: '13px',

                                                            '&:hover': {
                                                                backgroundColor: '#000', // Keep the same background color on hover
                                                            },
                                                        }}
                                                        onClick={() => setIsEditProfile(true)}
                                                    >
                                                        Cập nhật thông tin!
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        endIcon={<EditIcon />}
                                                        color="primary"
                                                        size="large"
                                                        sx={{
                                                            fontFamily: 'Lora, serif',
                                                            marginLeft: '10px',
                                                            backgroundColor: '#000',
                                                            color: '#fff',
                                                            fontWeight: 'bold',
                                                            fontSize: '13px',

                                                            '&:hover': {
                                                                backgroundColor: '#000',
                                                            },
                                                        }}
                                                        onClick={() => setIsEditImg(true)}
                                                    >
                                                        Chỉnh sửa ảnh
                                                    </Button>
                                                </>
                                            )}
                                            {isEditImg && (
                                                <>
                                                    {' '}
                                                    <input
                                                        type="file"
                                                        accept=".jpg,.jpeg,.png"
                                                        onChange={handleImageUpload}
                                                    />{' '}
                                                    <Box display="flex" justifyContent="end" mt="20px">
                                                        <Button
                                                            type="submit"
                                                            color="secondary"
                                                            variant="contained"
                                                            sx={{
                                                                fontFamily: 'Lora, serif',
                                                                backgroundColor: '#000',
                                                                color: '#fff',
                                                                fontWeight: 'bold',
                                                                fontSize: '13px',

                                                                '&:hover': {
                                                                    backgroundColor: '#000',
                                                                },
                                                            }}
                                                            onClick={handleSubmitImg}
                                                        >
                                                            Cập nhật
                                                        </Button>
                                                        <Button
                                                            type="reset"
                                                            color="warning"
                                                            variant="contained"
                                                            sx={{
                                                                fontFamily: 'Lora, serif',
                                                                marginLeft: '10px',
                                                                backgroundColor: '#000',
                                                                color: '#fff',
                                                                fontWeight: 'bold',
                                                                fontSize: '13px',

                                                                '&:hover': {
                                                                    backgroundColor: '#000',
                                                                },
                                                            }}
                                                            onClick={() => {
                                                                setIsEditImg(false);
                                                                setImageBase64('');
                                                            }}
                                                        >
                                                            Hủy
                                                        </Button>
                                                    </Box>
                                                </>
                                            )}
                                            {isEditProfile && (
                                                <Formik
                                                    onSubmit={handleFormSubmitProfile}
                                                    initialValues={user}
                                                    validationSchema={checkoutSchema}
                                                >
                                                    {({
                                                        values,
                                                        errors,
                                                        touched,
                                                        handleBlur,
                                                        handleChange,
                                                        handleSubmit,
                                                    }) => (
                                                        <form onSubmit={handleSubmit}>
                                                            <Box
                                                                display="grid"
                                                                gap="30px"
                                                                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                                                // sx={{ fontFamily: 'Lora'}}
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
                                                                    sx={{
                                                                        gridColumn: 'span 4',
                                                                        fontSize: '26px',

                                                                        '& label': {
                                                                            fontFamily: 'Lora, serif',
                                                                            fontSize: '18px',
                                                                        },
                                                                        '& input': {
                                                                            fontFamily: 'Lora, serif',
                                                                            fontSize: '16px',
                                                                        },
                                                                        '& p': {
                                                                            fontFamily: 'Lora, serif',
                                                                            fontSize: '12px',
                                                                        },
                                                                    }}
                                                                />

                                                                <TextField
                                                                    fullWidth
                                                                    variant="filled"
                                                                    type="date"
                                                                    label="Ngày sinh"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    value={values.birthday}
                                                                    name="birthday"
                                                                    error={!!touched.birthday && !!errors.birthday}
                                                                    helperText={touched.birthday && errors.birthday}
                                                                    sx={{
                                                                        gridColumn: 'span 4',
                                                                        fontSize: '26px',

                                                                        '& label': {
                                                                            fontFamily: 'Lora, serif',
                                                                            fontSize: '18px',
                                                                        },
                                                                        '& input': {
                                                                            fontFamily: 'Lora, serif',
                                                                            fontSize: '16px',
                                                                        },
                                                                        '& p': {
                                                                            fontFamily: 'Lora, serif',
                                                                            fontSize: '12px',
                                                                        },
                                                                    }}
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
                                                                    sx={{
                                                                        gridColumn: 'span 4',
                                                                        fontSize: '26px',

                                                                        '& label': {
                                                                            fontFamily: 'Lora, serif',
                                                                            fontSize: '18px',
                                                                        },
                                                                        '& input': {
                                                                            fontFamily: 'Lora, serif',
                                                                            fontSize: '16px',
                                                                        },
                                                                        '& p': {
                                                                            fontFamily: 'Lora, serif',
                                                                            fontSize: '12px',
                                                                        },
                                                                    }}
                                                                />
                                                            </Box>

                                                            <Box display="flex" justifyContent="end" mt="20px">
                                                                <Button
                                                                    type="submit"
                                                                    color="secondary"
                                                                    variant="contained"
                                                                    sx={{
                                                                        fontFamily: 'Lora, serif',
                                                                        backgroundColor: '#000',
                                                                        color: '#fff',
                                                                        fontWeight: 'bold',
                                                                        fontSize: '13px',

                                                                        '&:hover': {
                                                                            backgroundColor: '#000',
                                                                        },
                                                                    }}
                                                                >
                                                                    Cập nhật
                                                                </Button>
                                                                <Button
                                                                    type="reset"
                                                                    color="warning"
                                                                    variant="contained"
                                                                    sx={{
                                                                        fontFamily: 'Lora, serif',
                                                                        marginLeft: '10px',
                                                                        backgroundColor: '#000',
                                                                        color: '#fff',
                                                                        fontWeight: 'bold',
                                                                        fontSize: '13px',

                                                                        '&:hover': {
                                                                            backgroundColor: '#000',
                                                                        },
                                                                    }}
                                                                    onClick={() => setIsEditProfile(false)}
                                                                >
                                                                    Hủy
                                                                </Button>
                                                            </Box>
                                                        </form>
                                                    )}
                                                </Formik>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </>
    );
}
const checkoutSchema = yup.object().shape({
    name: yup.string().required('Không được bỏ trống'),
    birthday: yup
        .date()
        .max(new Date(), 'Ngày phải nhỏ hơn hoặc bằng ngày hiện tại')
        .min(new Date('1930-01-01'), 'Ngày không được nhỏ hơn năm 1930')
        .required('Không được bỏ trống'),
    email: yup.string().email('Sai định dạng email').required('Không được bỏ trống'),
});

export default Profile;
