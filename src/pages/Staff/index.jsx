import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Breadcrumbs } from '~/pages/Breadcrumbs';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';
import './Staff.css';
import { useEffect } from 'react';
import axios from '~/utils/api/axios';
import avatarDefault from '~/assets/images/avatarDefault.jpg';
import { Avatar } from '@mui/material';

function Staff() {
    const [staffs, setStaffs] = useState([]);
    // ... (rest of your state variables and constants)

    function mapRole(role) {
        switch (role) {
            case 'ROLE_STAFF':
                return 'Chuyên gia';
            default:
                return role;
        }
    }

    useEffect(() => {
        // Fetch staff data from the API
        axios
            .get(`/users/staff`) // Update the URL to match your API endpoint
            .then((response) => {
                setStaffs(response.data);
            })
            .catch((error) => {
                console.error('Error fetching staff data:', error);
            });
    }, []);

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

    const pageCount = Math.ceil(staffs.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentStaffs = staffs.slice(offset, offset + itemsPerPage);

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    return (
        <div style={{ width: '79%' }}>
            <section
                className="header"
                style={{
                    '--bg-url': `url(${'https://theme.hstatic.net/1000181446/1000235350/14/image_breadcrumb_bg.png?v=1737'})`,
                }}
            >
                <h1 className="heading">ĐỘI NGŨ CHUYÊN GIA</h1>
                <Breadcrumbs className="breadcrumbs">
                    <Link className="breadcrumb-link" to="/">
                        Trang chủ
                    </Link>
                    <Link className="breadcrumb-link" to="/staff">
                        Đội ngũ chuyên gia
                    </Link>
                </Breadcrumbs>
            </section>
            <h2 className="staff-content">ĐỘI NGŨ CHUYÊN GIA GIÀU KINH NGHIỆM</h2>
            <p className="staff-all-desc">
                Với đội ngũ chuyên gia được đào tạo bài bản từ Hoa Kỳ và các nhân viên stylist & skinner giàu kinh
                nghiệm, chúng tôi tự tin có thể giúp bạn có một mái tóc thật phong cách và cá tính. Từ những kiểu tóc
                nam cổ điển như Mop-top của The Beatles cho đến hiện đại của các ngôi sao bóng đá hay ngôi sao giải trí.
            </p>
            <div className="staff-list">
                {currentStaffs.map((staff, index) => (
                    <div className="staff-item grid-col" key={index}>
                        <Avatar
                            className="staff-img"
                            src={staff.img ? staff.img : avatarDefault}
                            alt={staff.name}
                            sx={{ width: 160, height: 160 }}
                        />
                        {/* <img className="staff-img" src={staff.img ? staff.img : avatarDefault} alt={staff.name} /> */}
                        <h3 className="staff-name">{staff.name}</h3>
                        <p>{mapRole(staff.role)}</p>
                    </div>
                ))}
            </div>
            <div className="paginate-wrapper">
                <ReactPaginate
                    previousLabel={<MdKeyboardArrowLeft size={24} />}
                    nextLabel={<MdKeyboardArrowRight size={24} />}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageChange}
                    containerClassName={'paginateContainer'}
                    activeClassName={'active'}
                />
            </div>
        </div>
    );
}

export default Staff;
