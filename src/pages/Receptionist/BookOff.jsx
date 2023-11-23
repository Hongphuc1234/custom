import {
    Box,
    Button,
    Checkbox,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Paper,
    TextField,
    useMediaQuery,
} from '@mui/material';
import axios from '~/utils/api/axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { isReceptionist } from '~/utils/jwt';
import moment from 'moment';

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function BookOff() {
    const isNonMobile = useMediaQuery('(min-width:600px)');
    const [totalPrice, setTotalPrice] = useState(0);
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);
    const [time, setTime] = useState([]);
    const user = useSelector((state) => state.auth.login?.currenUser);
    const navigate = useNavigate();
    useEffect(() => {
        const newTotalPrice = right.reduce((total, element) => total + element.price, 0);
        setTotalPrice(newTotalPrice);
    }, [right]);

    useEffect(() => {
        axios
            .get(`/service`)
            .then((res) => {
                const service = res.data;
                const modifiedData = service.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                }));
                setLeft(modifiedData);
            })
            .catch((error) => console.log(error));
        axios
            .get(`/receptionist`)
            .then((res) => {
                setTime(res.data);
            })
            .catch((error) => console.log(error));
    }, []);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const handleFormSubmit = (values, { resetForm }) => {
        const serviceIds = right.map((item) => item.id);
        if (user && isReceptionist(user.accessToken)) {
            if (right.length !== 0) {
                const data = {
                    phone: values.phone,
                    idReceptionist: user.id,
                    total: totalPrice,
                    time: values.time,
                    date: moment().add(0, 'days').format('DD/MM/YYYY'),
                    serviceId: serviceIds,
                };
                axios
                    .post(`/receptionist`, data)
                    .then((res) => {
                        if (res.data === 'done') {
                            resetForm();
                            setLeft(left.concat(right));
                            setRight([]);
                            toast.success('Tạo mới đơn hàng thành công!', {
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
            } else {
                toast.warning('Bạn chưa chọn dịch vụ!', {
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
    };

    const customList = (items) => (
        <Paper sx={{ width: 300, height: 430, overflow: 'auto', border: '1px solid #000' }}>
            <List dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-item-${value.id}-label`;

                    return (
                        <ListItem key={value.id} role="listitem" button onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                id={labelId}
                                primary={`Dịch vụ ${value.name}`}
                                sx={{
                                    '& span': {
                                        fontFamily: 'Lora, serif',
                                        fontSize: '16px',
                                    },
                                }}
                            />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );

    return user && isReceptionist(user.accessToken) ? (
        <>
            <div className="container">
                <Box m="20px" sx={{ fontFamily: 'Lora, serif' }}>
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
                                        label="Số điện thoại"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.phone}
                                        name="phone"
                                        error={!!touched.phone && !!errors.phone}
                                        helperText={touched.phone && errors.phone}
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
                                        select
                                        label="Chọn giờ"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.time}
                                        name="time"
                                        error={!!touched.time && !!errors.time}
                                        helperText={touched.time && errors.time}
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
                                            '& div': {
                                                fontFamily: 'Lora, serif',
                                                fontSize: '12px',
                                            },
                                        }}
                                    >
                                        <MenuItem
                                            key={-1}
                                            value={0}
                                            sx={{ fontFamily: 'Lora, serif', fontSize: '12px' }}
                                        >
                                            Chọn giờ
                                        </MenuItem>
                                        {time.map((value) => {
                                            return (
                                                <MenuItem
                                                    key={value.id}
                                                    value={value.id}
                                                    sx={{ fontFamily: 'Lora, serif', fontSize: '12px' }}
                                                >
                                                    {value.time}
                                                </MenuItem>
                                            );
                                        })}
                                    </TextField>
                                </Box>
                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent="center"
                                    alignItems="center"
                                    style={{ marginTop: '20px' }}
                                >
                                    <Grid item>{customList(left)}</Grid>
                                    <Grid item>
                                        <Grid container direction="column" alignItems="center">
                                            <Button
                                                style={{
                                                    my: 0.5,
                                                    backgroundColor: 'black',
                                                    color: 'white',
                                                    padding: '4px 12px',
                                                    fontSize: '14px',
                                                }}
                                                variant="outlined"
                                                size="small"
                                                onClick={handleAllRight}
                                                disabled={left.length === 0}
                                                aria-label="move all right"
                                            >
                                                ≫
                                            </Button>
                                            <Button
                                                style={{
                                                    my: 0.5,
                                                    marginTop: '5px',
                                                    backgroundColor: 'black',
                                                    color: 'white',
                                                    padding: '4px 12px',
                                                    fontSize: '14px',
                                                }}
                                                variant="outlined"
                                                size="small"
                                                onClick={handleCheckedRight}
                                                disabled={leftChecked.length === 0}
                                                aria-label="move selected right"
                                            >
                                                &gt;
                                            </Button>
                                            <Button
                                                style={{
                                                    my: 0.5,
                                                    marginTop: '5px',
                                                    backgroundColor: 'black',
                                                    color: 'white',
                                                    padding: '4px 12px',
                                                    fontSize: '14px',
                                                }}
                                                variant="outlined"
                                                size="small"
                                                onClick={handleCheckedLeft}
                                                disabled={rightChecked.length === 0}
                                                aria-label="move selected left"
                                            >
                                                &lt;
                                            </Button>
                                            <Button
                                                style={{
                                                    my: 0.5,
                                                    marginTop: '5px',
                                                    backgroundColor: 'black',
                                                    color: 'white',
                                                    padding: '4px 12px',
                                                    fontSize: '14px',
                                                }}
                                                variant="outlined"
                                                size="small"
                                                onClick={handleAllLeft}
                                                disabled={right.length === 0}
                                                aria-label="move all left"
                                            >
                                                ≪
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid item>{customList(right)}</Grid>
                                </Grid>
                                <div style={{ textAlign: 'end', fontSize: '3rem', marginTop: '20px' }}>
                                    Tổng tiền: <span>{totalPrice.toLocaleString('en-US')}</span> VNĐ
                                </div>
                                <Box display="flex" justifyContent="end" mt="20px">
                                    <Button
                                        type="submit"
                                        color="secondary"
                                        variant="contained"
                                        sx={{
                                            backgroundColor: 'black',
                                            color: 'white',
                                            padding: '10px 20px',
                                            fontSize: '14px',
                                            '&:hover': {
                                                backgroundColor: '#333',
                                            },
                                        }}
                                    >
                                        Tạo dịch vụ
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>
            </div>
            <ToastContainer />
        </>
    ) : (
        navigate('/accessDeny')
    );
}
const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
const checkoutSchema = yup.object().shape({
    phone: yup.string().matches(phoneRegExp, 'Số điện thoại không hợp lệ!').required('Vui lòng nhập số điện thoại!'),
    time: yup.number().notOneOf([0], 'Vui lòng chọn giờ!'),
});
const initialValues = {
    time: 0,
    phone: '',
};
export default BookOff;
