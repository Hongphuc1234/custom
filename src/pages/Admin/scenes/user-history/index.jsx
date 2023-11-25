import React, { useState } from 'react';
import { Box ,Button} from '@mui/material';
import { DataGrid, viVN } from '@mui/x-data-grid';
import Header from '../../components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '~/utils/api/axios';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import './user-history.scss';

const HistoryBooking = () => {
    const [teamData, setTeamData] = useState([]);
    const user = useSelector((state) => state.auth.login?.currenUser);
    useEffect(() => {
        console.log(user);
        if (user && user.phone) {
            console.log('Fetching data for user:', user.phone); // Debugging
            axios
                .get(`/bookings/history/${user.phone}`)
                .then((res) => {
                    const bookingHistory = res.data;
                    console.log('Fetched data:', bookingHistory); // Debugging
                    setTeamData(bookingHistory);
                })
                .catch((error) => console.log('Error fetching data:', error)); // Debugging
        }
    }, [user]);

   const payment = (row) =>
   {
        axios.post(`/checkout/re-create-payment?bookingid=${row}`
        ).then((res)=>{
            window.location.href = res.data.url;
        })
   }


   const huy= (id) => {
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
                .get(`/bookings/delete/${id}`)
                .then((res) => {
                    if (id === res.data) {
                        const updatedTeamData = teamData.map((booking) => {
                            if (booking.id === id) {
                                return { ...booking, status: 3 };
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
        { field: 'id', headerName: 'ID', flex: 0.5 },
        {
            field: 'date',
            headerName: 'Ngày tháng',
            type: 'number',
            flex: 1.5,
            headerAlign: 'left',
            align: 'left',
        },
     
        {
            field: 'status',
            headerName: 'Trạng thái',
            type: 'text',
            headerAlign: 'left',
            align: 'left',
            flex: 1.5,
            renderCell: ({ row }) => {
                return (
                    <span>
                        {row.status === 0
                            ? 'Đang chờ'
                            : row.status === 1
                            ? 'Đã hoàn thành'
                            : row.status === 2
                            ? 'Đã chấp nhận'
                            : 'Hủy'}
                    </span>
                );
            },
        },
        {
            field: 'payment',
            headerName: 'Trạng thái thanh toán',
            flex: 2,
            type: 'text',
            headerAlign: 'left',
            align: 'left',
            renderCell: ({ row }) => {
                return <span>{row.payment === 0 ? 'Chưa thanh toán' : 'Đã thanh toán'}</span>;
            },
        },
        {
            field: 'totalPrice',
            headerName: 'Tổng tiền',
            flex: 1.5,
            headerAlign: 'left',
            align: 'left',
        },
    
       
        // {
        //     field: 'user', // Use a new field name
        //     headerName: 'Số điện thoại người dùng',
        //     flex: 1,
        //     headerAlign: 'left',
        //     align: 'left',
        //     renderCell: ({ row }) => {
        //         return (
        //             <div style={{ wordWrap: 'break-word' }}>
        //                 <div>{row.user.phone}</div>
        //             </div>
        //         );
        //     },
        // },
       
        {
            field: 'thanhtoan',
            headerName: 'thanh toán đơn hàng',
            flex: 2,
            type: 'text',
            headerAlign: 'left',
            align: 'left',
            renderCell: ({ row }) => {
                return  (row.payment === 0 && row.status!=1 && row.status!=3) ? (
                    <Box>
                        <Button
                            color="secondary"
                            variant="contained"
                            sx={{ fontFamily: 'Lora, serif' }}
                            onClick={() => payment(row.id)} 
                        >
                            Thanh toán
                        </Button>
                    </Box>
                ) : null;
            },
        },
        {
            field: 'Huy',
            headerName: 'Hủy đơn hàng',
            flex: 2,
            type: 'text',
            headerAlign: 'left',
            align: 'left',
            renderCell: ({ row }) => {
                return  (row.payment === 0 && row.status==0) ? (
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
    ];

    return (
        <>
            <div style={{ width: '100%', height: '100%' }}>
                <Box m="20px">
                    <Header title="Lịch sử giao dịch" />
                    <span className="history-subtitle">Quản lý lịch sử giao dịch</span>
                    <Box
                        m="40px 0 0 0"
                        height="500vh"
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
                        />
                    </Box>
                </Box>
                <ToastContainer />
            </div>
        </>
    );
};

export default HistoryBooking;
