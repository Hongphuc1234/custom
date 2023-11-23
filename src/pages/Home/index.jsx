import React from 'react';
import Slideshow from './slideshow';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import slideshow1 from '~/assets/images/home.jpg';
import slideshow2 from '~/assets/images/xe.jpg';
import slideshow3 from '~/assets/images/foof.jpg';
import axios from '~/utils/api/axios';
import { useEffect, useState } from 'react';
import avatarDefault from '~/assets/images/avatarDefault.jpg';

const cx = classNames.bind(styles);
function Home() {
    const slideshowImages = [slideshow1, slideshow2, slideshow3];
    const [topUsers, setTopUsers] = useState([]);
    const [mostBookedServices, setMostBookedServices] = useState([]);

    function mapRole(role) {
        switch (role) {
            case 'ROLE_STAFF':
                return 'Chuyên gia';
            default:
                return role;
        }
    }

    return (
        <>
        
            <Slideshow slides={slideshowImages} />
            <div className={cx('about')}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-5 col-md-6">
                            <div className={cx('about-img')}>
                                <img src={process.env.PUBLIC_URL + '/img/food.jpg'} alt="about" />
                            </div>
                        </div>
                        <div className="col-lg-7 col-md-6">
                            <div className={cx('section-header')} style={{ textAlign: 'center' }}>
                                <h2>TRẢI NGHIỆM DỊCH VỤ HÀNG ĐẦU VIỆT NAM </h2>
                            </div>
                            <div className={cx('about-text')}>
                                <p>
                                    Thành lập từ năm 2023, MarketHome vẫn luôn đứng vững  trong ngành mua bán online
                                    
                                </p>
                                <p>
                                    Quy tụ đa dạng mặt hàng, với hàng ngàn lượt bán ra mỗi ngày .
                                </p>
                                <p>
                                    Chúng tôi hạnh phúc khi mỗi ngày được đem đến cho mọi người dịch vụ tốt nhất .
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('service')}>
                <div className="container">
                    <div className={cx('section-header')} style={{ textAlign: 'center' }}>
                        <h2>Dịch vụ tốt nhất cho bạn</h2>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-6">
                            <div className={cx('service-item')}>
                                <div className={cx('service-img')}>
                                    <img src={process.env.PUBLIC_URL + '/img/xe1.jpg'} alt="service" />
                                </div>
                                <h3>Xe</h3>
                                <p>Tổng hợp các mẫu xe mới và cũ đang bán chạy trên thị trường</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className={cx('service-item')}>
                                <div className={cx('service-img')}>
                                    <img src={process.env.PUBLIC_URL + '/img/phone4.jpg'} alt="service" />
                                </div>
                                <h3>Điện Thoại</h3>
                                <p>Có đầy đủ những hãng điện thoại lớn nhỏ </p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className={cx('service-item')}>
                                <div className={cx('service-img')}>
                                    <img src={process.env.PUBLIC_URL + '/img/pet1.jpg'} alt="service" />
                                </div>
                                <h3>Thú Cưng</h3>
                                <p>Tất cả những loại thú cưng hiện nay</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
