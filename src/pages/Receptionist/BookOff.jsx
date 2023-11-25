import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { DataGrid, viVN } from '@mui/x-data-grid';
import axios from '~/utils/api/axios';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
import isAdmin, { isReceptionist } from '~/utils/jwt';
import { useNavigate } from 'react-router-dom';
import { HiCurrencyYen } from 'react-icons/hi';
function AcceptService() {
    const [teamData, setTeamData] = useState([]);
    const user = useSelector((state) => state.auth.login?.currenUser);
    const navigate = useNavigate();
    useEffect(() => {
        if (user) {
            axios
                .get(`/receptionist/ser`)
                .then((res) => {
                    const user1 = res.data;
                    setTeamData(user1);
                })
                .catch((error) => console.log(error));
        }
    }, [user]);
    
    const handleAcceptClick = (id) => {
        Swal.fire({
            html: `<h4>Xác nhận Bài đăng!</h4>`,
            // input: 'number',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Đóng',
            showLoaderOnConfirm: true,
            confirmButtonColor: '#4caf50',
            cancelButtonColor: ' #D3D3D3',
            allowOutsideClick: false,
            preConfirm: (code) => {
                return axios
                    .get(`/receptionist/acceptSer/${id}`)
                    .then((res) => {
                        if (id === res.data) {
                            const updatedTeamData = teamData.map((booking) => {
                                if (booking.id === id) {
                                    return { ...booking, status: 0 };
                                }
                                return booking;
                            });
                            setTeamData(updatedTeamData);
                        }
                    })
                    .catch((error) => console.log(error));
            },
        });
    };
    const huy= (id) => {
        var ins =-1;
        Swal.fire({
            html: `<h4>Xác nhận hủy!</h4>`,
            // input: 'number',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Đóng',
            showLoaderOnConfirm: true,
            confirmButtonColor: '#4caf50',
            cancelButtonColor: ' #D3D3D3',
            allowOutsideClick: false,
            preConfirm: (code) => {
                return axios
                    .get(`/receptionist/remove/${id}`)
                    .then((res) => {
                        if (id === res.data) {
                            const newArray = teamData.filter(item => item.id !== id);
                            setTeamData(newArray)
                        }
                    })
                    .catch((error) => console.log(error));
                
            },
        });
    };
    const handlePaymentClick = (id) => {
        Swal.fire({
            html: `<h4>Xác nhận đơn hàng đã được thánh toán!</h4>`,
            // input: 'number',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Đóng',
            showLoaderOnConfirm: true,
            confirmButtonColor: '#4caf50',
            cancelButtonColor: ' #D3D3D3',
            allowOutsideClick: false,
            preConfirm: (code) => {
                return axios
                    .get(`/receptionist/payment/${id}`)
                    .then((res) => {
                        if (id === res.data) {
                            const updatedTeamData = teamData.map((booking) => {
                                if (booking.id === id) {
                                    return { ...booking, payment: 1 };
                                }
                                return booking;
                            });
                            setTeamData(updatedTeamData);
                        }
                    })
                    .catch((error) => console.log(error));
            },
        });
    };
    const columns = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'name',
            headerName: 'Tên',
            flex: 1,
            renderCell: ({ row }) => {
                if (row.name) {
                    return row.name;
                } else {
                    return 'Khách hàng';
                }
            },
        },
        {
            field: 'description',
            headerName: 'Mô tả',
            type: 'text',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            renderCell: ({ row }) => {
                const timestamp = row.time;
                if (timestamp) {
                    return row.date + ' | ' + row.time.times;
                } else {
                    return row.date;
                }
            },
        },
        {
            field: 'img',
            headerName: 'Ảnh',
            flex: 1,
            renderCell: ({ row }) => {
                return <img src={row.img} style={{height:"60px",width:"60px"}} alt="" />
            },
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            flex: 1,
            renderCell: ({ row }) => {
                return row.status === 1 ? 'Đang chờ' :  row.status === 2 ?'hủy' : row.status === 0 ? 'Đã xác nhận' : 'không';
            },
        },
        
        {
            field: 'price',
            headerName: 'Giá',
            flex: 1,
        },
        {
            field: 'Hủy',
            headerName: 'Hủy đơn hàng',
            flex: 1,
            renderCell: ({ row }) => {
                return row.status == 1 ? (
                    <Box>
                        <Button
                            color="secondary"
                            variant="contained"
                            sx={{ fontFamily: 'Lora, serif' }}
                            onClick={() => huy(row.id)}
                        >
                            Hủy
                        </Button>
                    </Box>
                ) : null;
            },
        },
        {
            field: 'action',
            headerName: 'Xác nhận',
            flex: 1,
            renderCell: ({ row }) => {
                return row.status === 1 ? (
                    <Box>
                        <Button
                            color="success"
                            variant="contained"
                            sx={{ fontFamily: 'Lora, serif' }}
                            onClick={() => handleAcceptClick(row.id)}
                        >
                            Xác nhận
                        </Button>
                    </Box>
                ) : null;
            },
        },

    ];
    return user && isAdmin(user.accessToken) ? (
        <>
            <div style={{ width: '100%', height: '100%' }}>
                <Box
                    m="40px"
                    height="90vh"
                    sx={{
                        '& .MuiDataGrid-root': {
                            border: '1px solid #ccc',
                            fontSize: '14px',
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid #333',
                            backgroundColor: '#fbfbfb1',
                        },
                        '& .name-column--cell': {
                            backgroundColor: '#fbfbfb1',
                            border: '1px solid #ccc',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#000',
                            color: '#fff',
                            border: '1px solid #ccc',
                        },
                        '& .MuiDataGrid-virtualScroller': {
                            backgroundColor: '#fbfbfb1',
                            border: '1px solid #ccc',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            backgroundColor: '#000',
                            border: '1px solid #ccc',
                            '& p': {
                                fontSize: '14px',
                                color: '#fff',
                            },
                        },
                        '& .MuiCheckbox-root': {
                            color: '#fbfbfb1 !important',
                        },
                        '& .MuiToolbar-root': {
                            fontSize: '14px',
                            color: '#fff',
                        },
                    }}
                >
                    <DataGrid
                        rows={teamData}
                        columns={columns}
                        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                        sx={{ wordWrap: 'break-word' }}
                    />
                </Box>
            </div>
        </>
    ) : (
        navigate('/accessDeny')
    );
}

export default AcceptService;
