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
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from '~/utils/api/axios';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import { ToastContainer, toast } from 'react-toastify';
function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

const Form = () => {
    const isNonMobile = useMediaQuery('(min-width:600px)');
    const [initialValues, setInitialValues] = useState();
    const [receptionistRole, setReceptionistRole] = useState(false);
    const [branchData, setBranchData] = useState([]);
    let id = useParams();
    const navigate = useNavigate();
    const handleFormSubmit = (values) => {
        const formData = {
            id: values.id,
            name: values.name,
            email: values.email,
            phone: values.phone,
            birthday: values.birthday,
            branch: values.branch ? values.branch : 0,
            role: right,
        };
        if (!receptionistRole && formData.branch === 0) {
            toast.warning('Bạn chưa chọn chi nhánh!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            });
            return;
        }
        axios
            .put(`/auth/updateAdmin`, formData)
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
                    case 'id':
                        toast.warning('ID không tồn tại!', {
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
                        navigate('/dataUser');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    useEffect(() => {
        const hasReceptionistOrStaffRole = right.some(
            (role) => role.name === 'ROLE_RECEPTIONIST' || role.name === 'ROLE_STAFF',
        );
        setReceptionistRole(!hasReceptionistOrStaffRole);
    }, [right]);

    useEffect(() => {
        axios
            .get(`/auth/detail/${id.id}`)
            .then((res) => {
                const user = res.data;
                setRight(user.roles);
                if (user.branch) {
                    let idBranch = user.branch?.id;
                    user.branch = idBranch;
                }
                const hasReceptionistOrStaffRole = user.roles.some(
                    (role) => role.name === 'ROLE_RECEPTIONIST' || role.name === 'ROLE_STAFF',
                );
                setReceptionistRole(!hasReceptionistOrStaffRole);
                setInitialValues(user);
                axios
                    .get(`/auth/role`)
                    .then((res) => {
                        const allRoles = res.data;
                        const userRoles = user.roles;
                        const leftRoles = allRoles.filter(
                            (role) => !userRoles.some((userRole) => userRole.id === role.id),
                        );
                        setLeft(leftRoles);
                    })
                    .catch((error) => {
                        console.log(error);
                        if (error.response.status === 404) {
                            navigate('/404');
                        }
                    });
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 404) {
                    navigate('/404');
                }
            });
    }, [id.id, navigate]);

    useEffect(() => {
        axios
            .get(`/branch`)
            .then((res) => {
                const branch = res.data;
                setBranchData(branch);
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

    const customList = (items) => (
        <Paper sx={{ width: 300, height: 300, overflow: 'auto' }}>
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
                                primary={` ${value.name}`}
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

    return (
        <>
            <Box m="20px">
                <Header title="Cập nhật người dùng" />
                {initialValues && (
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
                                        sx={{ gridColumn: 'span 4' }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        // type="text"
                                        disabled={receptionistRole}
                                        select
                                        label="Chi nhánh"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.branch ? values.branch : 0}
                                        name="branch"
                                        sx={{ gridColumn: 'span 4' }}
                                    >
                                        <MenuItem value={0}>Chọn chi nhánh</MenuItem>
                                        {branchData.map((values) => (
                                            <MenuItem key={values.id} value={values.id}>
                                                {values.address}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>

                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent="center"
                                    alignItems="center"

                                    // style={{ marginTop: '20px' }}
                                >
                                    <Grid item>{customList(left)}</Grid>
                                    <Grid item>
                                        <Grid container direction="column" alignItems="center">
                                            <Button
                                                sx={{ my: 0.5 }}
                                                variant="outlined"
                                                size="small"
                                                onClick={handleAllRight}
                                                disabled={left.length === 0}
                                                aria-label="move all right"
                                            >
                                                ≫
                                            </Button>
                                            <Button
                                                sx={{ my: 0.5 }}
                                                variant="outlined"
                                                size="small"
                                                onClick={handleCheckedRight}
                                                disabled={leftChecked.length === 0}
                                                aria-label="move selected right"
                                            >
                                                &gt;
                                            </Button>
                                            <Button
                                                sx={{ my: 0.5 }}
                                                variant="outlined"
                                                size="small"
                                                onClick={handleCheckedLeft}
                                                disabled={rightChecked.length === 0}
                                                aria-label="move selected left"
                                            >
                                                &lt;
                                            </Button>
                                            <Button
                                                sx={{ my: 0.5 }}
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

                                <Box display="flex" justifyContent="end" mt="20px">
                                    <Button type="submit" color="secondary" variant="contained">
                                        Lưu
                                    </Button>
                                    <Link to={'/dataUser'}>
                                        <Button type="submit" color="warning" variant="contained">
                                            Hủy
                                        </Button>
                                    </Link>
                                </Box>
                            </form>
                        )}
                    </Formik>
                )}
            </Box>
            <ToastContainer />
        </>
    );
};

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
    name: yup.string().required('Không được bỏ trống'),
    email: yup.string().email('Không đúng định dạng email').required('Không được bỏ trống'),
    phone: yup.string().matches(phoneRegExp, 'Không đúng định dạng số điện thoại').required('Không được bỏ trống'),
    birthday: yup
        .date()
        .max(new Date(), 'Ngày phải nhỏ hơn hoặc bằng ngày hiện tại')
        .min(new Date('1930-01-01'), 'Ngày không được nhỏ hơn năm 1930')
        .required('Không được bỏ trống'),
});

export default Form;
