import React, { useState, useEffect } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import { DataGrid, viVN } from '@mui/x-data-grid';
import { tokens } from '~/utils/theme/theme';
import axios from '~/utils/api/axios';
import Header from '../../components/Header';
import { IconButton } from '@mui/material';
// import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Link } from 'react-router-dom';
import GridCustom from '../../components/GridCustom';
import { BASE_URL } from '~/utils/api/axios';
const Team = () => {
    const [teamData, setTeamData] = useState([]);

    useEffect(() => {
        axios
            .get(`/auth`)
            .then((res) => {
                const user = res.data;
                setTeamData(user);
            })
            .catch((error) => console.log(error));
    }, []);

    // const handleDelete = (id) => {
    //     setTeamData((prevData) => prevData.filter((item) => item.id !== id));
    // };

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
            field: 'birthday',
            headerName: 'Ngày sinh',
            type: 'number',
            headerAlign: 'left',
            align: 'left',
            flex: 1,
        },
        {
            field: 'phone',
            headerName: 'Số điện thoại',
            flex: 1,
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
        },
        {
            field: 'roles',
            headerName: 'Role',
            flex: 1,
            renderCell: ({ row }) => {
                return (
                    <div style={{ wordWrap: 'break-word' }}>
                        {row.roles.map((role) => (
                            <div key={role.id}>{role.name},</div>
                        ))}
                    </div>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Hành động',
            flex: 1,
            renderCell: ({ row: { id } }) => {
                return (
                    <Box display="flex" justifyContent="center">
                        <Link to={`/editUser/${id}`}>
                            <IconButton aria-label="Edit" size="small">
                                <EditOutlinedIcon />
                            </IconButton>
                        </Link>

                        {/* <IconButton
                            aria-label="Delete"
                            size="small"
                            onClick={() => {
                                handleDelete(id);
                            }}
                        >
                            <DeleteOutlinedIcon />
                        </IconButton> */}
                    </Box>
                );
            },
        },
    ];

    return (
        <Box m="20px">
            <Header title="Người dùng" subtitle="Quản lý người dùng" />
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
                    sx={{ wordWrap: 'break-word' }}
                    slots={{ toolbar: GridCustom }}
                />
            </Box>
        </Box>
    );
};

export default Team;
