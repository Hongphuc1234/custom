import React, { useState, useEffect } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { DataGrid, viVN } from '@mui/x-data-grid';
import { tokens } from '~/utils/theme/theme';
import axios, { BASE_URL } from '~/utils/api/axios';
import Header from '../../components/Header';
import { IconButton } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Link } from 'react-router-dom';
import ConfirmBox from '../../components/ConfirmBox';
import { ToastContainer, toast } from 'react-toastify';
import GridCustom from '../../components/GridCustom';
import 'react-toastify/dist/ReactToastify.css';

const Service = () => {
    const [teamData, setTeamData] = useState([]);
    const [open, setOpen] = useState(false);
    const [deleteData, setDeleteData] = useState(null);

    useEffect(() => {
        axios
            .get(`/service/admin`)
            .then((res) => {
                const branch = res.data;
                setTeamData(branch);
            })
            .catch((error) => console.log(error));
    }, []);

    function deleteUser() {
        axios
            .delete(`/service/${deleteData}`)
            .then((res) => {
                setOpen(false);
                setTeamData((prevData) => prevData.filter((item) => item.id !== deleteData));
                toast.success('Xóa thành công', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,    
                    theme: 'light',
                });
            })
            .catch((err) => {
                console.log(err);
                if (err.response.status === 404) {
                    setOpen(false);
                    toast.warning('Không tìm thấy dịch vụ', {
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
            });
    }

    function openDelete(id) {
        setOpen(true);
        setDeleteData(id);
    }

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'name',
            headerName: 'Tên',
            flex: 1,
        },
        {
            field: 'price',
            headerName: 'Giá',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            valueFormatter: ({ value }) => {
                return value.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'VND', // Change this to your desired currency code
                    minimumFractionDigits: 0,
                });
            },
        },
        {
            field: 'description',
            headerName: 'Mô tả',
            type: 'text',
            headerAlign: 'left',
            align: 'left',
            flex: 2,
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            type: 'text',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            renderCell: ({ row: { status } }) => {
                return <span>{status === 0 ? 'Không hoạt động' : 'Hoạt động'}</span>;
            },
        },

        {
            field: 'actions',
            headerName: 'Hành động',
            flex: 1,
            renderCell: ({ row: { id } }) => {
                return (
                    <Box display="flex" justifyContent="center">
                        <Link to={`/editService/${id}`}>
                            <IconButton aria-label="Edit" size="small">
                                <EditOutlinedIcon />
                            </IconButton>
                        </Link>

                        <IconButton
                            aria-label="Delete"
                            size="small"
                            onClick={() => {
                                openDelete(id);
                            }}
                        >
                            <DeleteOutlinedIcon />
                        </IconButton>
                    </Box>
                );
            },
        },
    ];

    return (
        <>
            <Box m="20px">
                <Header title="Dịch vụ" subtitle="Quản lý dịch vụ" />
                <Box display="flex" justifyContent="start" mt="20px">
                    
                </Box>
                <Box
                    m="40px 0 0 0"
                    height="75vh"
                    sx={{
                        '& .MuiDataGrid-root': {
                            border: 'none',
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: 'none',
                        },
                        '& .name-column--cell': {
                            color: colors.greenAccent[300],
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: colors.blueAccent[700],
                            borderBottom: 'none',
                        },
                        '& .MuiDataGrid-virtualScroller': {
                            backgroundColor: colors.primary[400],
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: 'none',
                            backgroundColor: colors.blueAccent[700],
                        },
                        '& .MuiCheckbox-root': {
                            color: `${colors.greenAccent[200]} !important`,
                        },
                    }}
                >
                    <DataGrid
                        rows={teamData}
                        columns={columns}
                        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                        slots={{ toolbar: GridCustom }}
                    />
                </Box>
            </Box>
            <ConfirmBox
                open={open}
                closeDialog={() => setOpen(false)}
                title={'Bạn có chắc muốn xóa dịch vụ!'}
                deleteFunction={deleteUser}
            />
            <ToastContainer />
        </>
    );
};

export default Service;
