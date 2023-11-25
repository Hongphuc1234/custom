import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md';
import { Breadcrumbs } from '~/pages/Breadcrumbs';
import { ServiceItem } from '~/pages/ServiceItem';
import './Service.css';
import SearchService from '~/components/Search';
import axios from '~/utils/api/axios';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Service() {
    const [services, setServices] = useState([]);

    useEffect(() => {
        axios
            .get(`/service`)
            .then((response) => {
                setServices(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

    const pageCount = Math.ceil(services.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentServices = services.slice(offset, offset + itemsPerPage);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        axios
            .get(`/service`)
            .then((response) => {
                const filteredServices = response.data.filter((service) =>
                    service.name.toLowerCase().includes(searchQuery.toLowerCase()),
                );
                setServices(filteredServices);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [searchQuery]);

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const handleSearch = (searchResults) => {
        setServices(searchResults);
    };
    const da = (e)=>{
       axios.get(`/service/cateo/${e}`)
    .then((res) =>{
        setServices(res.data);
    })
}

    return (
        <div>
            <section
                className="header"
                style={{
                    '--bg-url': `url(${'https://haiquanonline.com.vn/stores/news_dataimages/thanhnt/082019/24/09/1737_tmdt.jpg'})`,
                }}
            >
                <h1 className="heading">CÁC DỊCH VỤ</h1>
                <Breadcrumbs className="breadcrumbs">
                    <Link className="breadcrumb-link" to="/">
                        Trang chủ
                    </Link>
                    <Link className="breadcrumb-link" to="/service">
                        Các dịch vụ
                    </Link>
                </Breadcrumbs>
            </section>
            <section className="body">
                <h2 className="heading">Hãy là người mua sắm thông minh</h2>
                <p className="sub-heading">
                    Chúng tôi hạnh phúc khi mỗi ngày đem đến cho bạn trải nghiệm tốt nhất về việc mua h 
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore iusto at asperiores quasi, excepturi sint. Ut repellat nesciunt veritatis beatae, dignissimos error molestiae suscipit eum, fuga distinctio excepturi, hic omnis.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae cumque corporis sed nam in alias quasi illum culpa doloribus ratione quaerat eveniet consectetur, minima facere hic nemo ipsa laboriosam voluptate.
                </p>
                <h1 style={{textAlign:"center"}}>Khám phá danh mục</h1>
                <div className="cateo ">
                    <div  className="xe"><img style={{width:"70px",borderRadius:"25%",heightL:"70px"}}  onClick={(e)=>da(1)} src={process.env.PUBLIC_URL + '/img/xe1.jpg'} alt="" />
                    <p>Xe cộ</p></div>
                    <div className="xe"><img style={{width:"70px",borderRadius:"25%",heightL:"70px"}} onClick={(e)=>da(2)} src={process.env.PUBLIC_URL + '/img/xe1.jpg'} alt="" />
                    <p>đồ điện tử</p></div>
                    <div className="xe"><img style={{width:"70px",borderRadius:"25%",heightL:"70px"}} onClick={(e)=>da(3)} src={process.env.PUBLIC_URL + '/img/xe1.jpg'} alt="" />
                    <p>Xe cộ</p></div>
                    <div className="xe"><img style={{width:"70px",borderRadius:"25%",heightL:"70px"}} onClick={(e)=>da(4)} src={process.env.PUBLIC_URL + '/img/xe1.jpg'} alt="" />
                    <p>Xe cộ</p></div>
                </div>
                <SearchService onSearch={handleSearch} />
                
                    {!currentServices || !services ? (
                        <h1>không có sản phẩm phù hợp</h1>
                    ):(
                        <div className="service-list">
                    {currentServices.map((service) => (
                        <ServiceItem
                            key={service.id}
                            id={service.id}
                            title={service.name}
                            imgUrl={service.img}
                        />
                    ))}
                    </div>)
                        }
                <div className="paginate-wrapper">
                <ReactPaginate
                        previousLabel={<MdKeyboardArrowLeft size={24} />}
                        nextLabel={<MdKeyboardArrowRight size={24} />}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={pageCount}
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                        containerClassName={'paginateContainer'}
                        activeClassName={'active'}
                        className={'s'}
                    />
                    </div>
            </section>
            
                    
                
        </div>
    );
}

export default Service
