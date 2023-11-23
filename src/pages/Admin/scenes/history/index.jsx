import React, { useState } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { DataGrid, viVN } from '@mui/x-data-grid';
import { tokens } from '~/utils/theme/theme';
import Header from '../../components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios, { BASE_URL } from '~/utils/api/axios';
import { useEffect } from 'react';
import GridCustom from '../../components/GridCustom';
const HistoryBooking = () => {
    const [teamData, setTeamData] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    useEffect(() => {
        axios
            .get(`/bookings/history/all`)
            .then((res) => {
                const bookingHistory = res.data;
                setTeamData(bookingHistory);
            })
            .catch((error) => console.log('Error fetching data:', error)); // Debugging
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'date',
            headerName: 'Ngày tháng',
            type: 'number',
            flex: 1,
            headerAlign: 'left',
            align: 'left',
        },
        
        {
            field: 'status',
            headerName: 'Trạng thái',
            type: 'text',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
            renderCell: ({ row }) => {
                return <span>{row.status === 0 ? 'Đang chờ' : row.status === 1 ? 'Đã hoàn thành' : row.status === 2 ?'Đã chấp nhận' : 'Hủy'}</span>;
            },
        },
        {
            field: 'payment',
            headerName: 'Trạng thái thanh toán',
            flex: 1,
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
            flex: 1,
            headerAlign: 'left',
            align: 'left',
        },
        
        {
            field: 'user', // Use a new field name
            headerName: 'Số điện thoại người dùng',
            flex: 1,
            headerAlign: 'left',
            align: 'left',
            renderCell: ({ row }) => {
                return (
                    <div style={{ wordWrap: 'break-word' }}>
                        <div>{row.user?.phone}</div>
                    </div>
                );
            },
        },
      
    ];

    return (
        <>
            <Box m="20px">
                <Header title="Lịch sử giao dịch" subtitle="Quản lý lịch sử giao dịch" />
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
            <ToastContainer />
        </>
    );
};

export default HistoryBooking;
