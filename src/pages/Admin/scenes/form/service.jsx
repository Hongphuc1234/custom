import { Box, Button, ImageList, ImageListItem, TextField } from '@mui/material';
import axios from '~/utils/api/axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from '../../components/Header';
import InputAdornment from '@mui/material/InputAdornment';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import * as React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
const Form = () => {
    const [itemData, setItemData] = useState([]);
    const user = useSelector((state) => state.auth.login?.currenUser);
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
    const isNonMobile = useMediaQuery('(min-width:600px)');
    const removeImg = (id) => {
        setItemData((prevItemData) => prevItemData.filter((item) => item.id !== id));
    };
    const handleFormSubmit = (values, { resetForm }) => {
        if (imageBase64 !== '') {
            const newImages = [];
            for (let i = 0; i < itemData.length; i++) {
                newImages.push(itemData[i].img);
            }
            const formValues = {
                ...values,
                name: values.name,
                price: values.price,
                category:values.category,
                description:values.description,
                img: imageBase64,
                imgList: newImages,
                userid:user.id,
            };
            axios
                .post(`/service`, formValues)
                .then((res) => {
                    toast.success('Tạo dịch vụ thành công!', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    });
                    resetForm();
                    setImageBase64('');
                    setItemData([]);
                })
                .catch((error) => console.log(error));
        } else {
            toast.warning('Bạn chưa chọn ảnh!', {
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
    const [imageBase64, setImageBase64] = useState('');

    function handleImageUploadMulti(event) {
        const files = event.target.files;
        const newItems = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (isImageFile(file)) {
                const reader = new FileReader();

                reader.onloadend = () => {
                    const base64String = reader.result;
                    newItems.push({ id: itemData.length + i, img: base64String });
                    // If all images have been processed, update the itemData state
                    if (i === files.length - 1) {
                        setItemData([...itemData, ...newItems]);
                    }
                };

                reader.readAsDataURL(file);
            } else {
                toast.warning('Đây không phải là ảnh!', {
                    // Toast settings...
                });
            }
        }
    }

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
    return (
        <>
            <Box m="100px" sx={{width:"400px"}}>
                <Header title="Tạo dịch vụ" />

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
                             id="outlined-select-currency-native"
                             label="Loại"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.category}
                                    name="category"
                                    error={!!touched.name && !!errors.name}
                                    select
                                    defaultValue="EUR"
                                    sx={{ gridColumn: 'span 4' }}
          helperText={touched.name && errors.name}
          SelectProps={{
            native: true,
          }}
        ><option value={0}>
        Chọn loại 
        </option>
            <option value={1}>
            XE
            </option>
            <option value={2}>
            Điện thoại
            </option>
            <option value={3}>
            Đồ điện tử
            </option>
            <option value={4}>
            Thú cưng
            </option>

            </TextField>

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Giá"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.price}
                                    name="price"
                                    error={!!touched.price && !!errors.price}
                                    helperText={touched.price && errors.price}
                                    sx={{ gridColumn: 'span 4' }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Mô tả"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.description}
                                    name="description"
                                    error={!!touched.description && !!errors.description}
                                    helperText={touched.description && errors.description}
                                    sx={{ gridColumn: 'span 4' }}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="file"
                                    label="Ảnh chính"
                                    onBlur={handleBlur}
                                    onChange={handleImageUpload}
                                    sx={{ gridColumn: 'span 4' }}
                                    inputProps={{
                                        accept: '.jpg,.jpeg,.png',
                                    }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                                    }}
                                />
                                {imageBase64 && (
                                    <img src={imageBase64} alt="Selected" style={{ width: '400px', height: '400px' }} />
                                )}
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="file"
                                    label="Ảnh phụ"
                                    onBlur={handleBlur}
                                    onChange={handleImageUploadMulti}
                                    sx={{ gridColumn: 'span 4' }}
                                    inputProps={{
                                        accept: '.jpg,.jpeg,.png',
                                        multiple: true,
                                    }}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"></InputAdornment>,
                                    }}
                                />
                                {itemData.length !== 0 && (
                                    <ImageList sx={{ width: 500, height: 450 }} variant="woven" cols={3} gap={8}>
                                        {itemData.map((item) => (
                                            <ImageListItem key={item.id}>
                                                <Button
                                                    variant="contained"
                                                    endIcon={<DeleteIcon />}
                                                    color="primary"
                                                    size="small"
                                                    sx={{ fontFamily: 'Lora, serif', backgroundColor: '#FE8A50' }}
                                                    onClick={() => removeImg(item.id)}
                                                >
                                                    Xóa
                                                </Button>
                                                <img src={item.img} alt={item.id} loading="lazy" />
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                )}
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Tạo dịch vụ
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
            {/* <ToastContainer /> */}
        </>
    );
};

const checkoutSchema = yup.object().shape({
    name: yup.string().required('Không hợp lệ'),
    price: yup.number().required('Không hợp lệ'),
    description: yup.string().required('Không hợp lệ'),
});
const initialValues = {
    name: '',
    price: '',
    description: '',
};

export default Form;
