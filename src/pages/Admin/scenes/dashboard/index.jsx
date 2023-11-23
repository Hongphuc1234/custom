import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '~/utils/theme/theme';
import axios from '~/utils/api/axios';
import Header from '~/pages/Admin/components/Header';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import StatBox from '~/pages/Admin/components/StatBox';

import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useEffect } from 'react';
import { useState } from 'react';

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [dashboardData, setDashboardData] = useState(null);
    useEffect(() => {
        axios
            .get(`/dashboard`)
            .then((res) => {
                const dashboard = res.data;
                setDashboardData(dashboard);
            })
            .catch((error) => console.log(error));
    }, []);
    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Bảng điều khiển" subtitle="Chào mừng bạn đến với bảng điều khiển" />
            </Box>
            {dashboardData && (
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
                    {/* ROW 1 */}
                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <StatBox
                            title={dashboardData.user}
                            subtitle="Khách hàng"
                            icon={<PersonRoundedIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
                        />
                    </Box>
                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <StatBox
                            title={dashboardData.branch}
                            subtitle="Chi nhánh"
                            icon={<ApartmentRoundedIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
                        />
                    </Box>
                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <StatBox
                            title={dashboardData.service}
                            subtitle="Dịch vụ"
                            icon={<ShoppingCartIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
                        />
                    </Box>
                    <Box
                        gridColumn="span 3"
                        backgroundColor={colors.primary[400]}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <StatBox
                            title={dashboardData.employee}
                            subtitle="Nhân viên"
                            icon={<PersonRoundedIcon sx={{ color: colors.greenAccent[600], fontSize: '26px' }} />}
                        />
                    </Box>
                    <Box gridColumn="span 6" backgroundColor={colors.primary[400]} overflow="auto">
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={`1px solid ${colors.primary[500]}`}
                            colors={colors.grey[100]}
                            p="15px"
                        >
                            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                                Tổng doanh thu.
                            </Typography>
                        </Box>
                        <Box marginTop="10px" marginLeft="20px">
                            <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                                VNĐ {dashboardData.totalPrice.toLocaleString('en-US')}
                            </Typography>
                            <Typography variant="h5" fontStyle="italic" sx={{ color: colors.greenAccent[600] }}>
                            Tổng doanh thu từ khi thành lập.
                        </Typography>
                        </Box>
                        
                    </Box>
                    <Box gridColumn="span 6" backgroundColor={colors.primary[400]} overflow="auto">
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={`1px solid ${colors.primary[500]}`}
                            colors={colors.grey[100]}
                            p="15px"
                        >
                            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                                Đơn hàng đã được xử lý.
                            </Typography>
                        </Box>
                        <Box marginTop="10px" display="flex" justifyContent="center" alignItems="center"  >
                            <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                                {dashboardData.booking}
                            </Typography>
                            
                        </Box>
                        <Box marginTop="10px" display="flex" justifyContent="space-between" alignItems="center"  >
                            <Typography variant="h5" fontStyle="italic" alignItems="center" sx={{ color: colors.greenAccent[600] }} p={'5px'}>
                                Tăng trưởng {dashboardData.increase}% so với 30 ngày trước.
                            </Typography>
                            <Typography variant="h5" fontStyle="italic" sx={{ color: colors.greenAccent[600] }}>
                                +{dashboardData.increase}%
                            </Typography>
                        </Box>
                    </Box>

                    <Box gridColumn="span 12" gridRow="span 2" backgroundColor={colors.primary[400]} overflow="auto">
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={`2px solid ${colors.primary[500]}`}
                            colors={colors.grey[100]}
                            p="15px"
                        >
                            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                                Các đơn hàng gần đây.
                            </Typography>
                        </Box>
                        {dashboardData.bookingDashboards.map((transaction, i) => (
                            <Box
                                key={`${transaction.id}-${i}`}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                // borderBottom={`4px solid ${colors.primary[500]}`}
                                p="15px"
                            >
                                <Box>
                                    <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                                       Đơn hàng {transaction.id}
                                    </Typography>
                                    <Typography color={colors.grey[100]}>{transaction.userName}</Typography>
                                </Box>
                                <Box color={colors.grey[100]}>{transaction.date}</Box>
                                <Box backgroundColor={colors.greenAccent[500]} p="5px 10px" borderRadius="4px">
                                    VNĐ {transaction.cost.toLocaleString('en-US') }
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
            {/* GRID & CHARTS */}
        </Box>
    );
};

export default Dashboard;
