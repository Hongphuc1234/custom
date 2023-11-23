import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import axios from '~/utils/api/axios';
import { addToCart } from '~/utils/store/authSlice';
import '~/pages/ServiceItem/serviceItem.scss';
import { BsArrowRight } from 'react-icons/bs';

export const ServiceItem = ({ id, title, imgUrl, onClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login?.currenUser);
    const HandleAddToCart = (e) => {
        e.preventDefault();
        if (user === null) {
            navigate('/login');
        } else {
            axios
                .post('/booking/addToCart', {
                    serviceID: id,
                    phone: user.phone,
                })
                .then((res) => {
                    if (res.data === 'ok') {
                        dispatch(addToCart(1));
                        Swal.fire({
                            html: `<h4>Thêm vào giỏ hàng thành công!</h4>`,
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 1100,
                        });
                    } else {
                        Swal.fire({
                            html: `<h4>Sản phẩm đã tồn tại trong giỏ hàng!</h4>`,
                            icon: 'error',
                            showConfirmButton: false,
                            timer: 2000,
                        });
                    }
                    console.log(id, user.phone);
                });
        }
    };

    return (
        <div className="service-wrapper" onClick={onClick}>
            <Link to={`/services/${id}`} className="item">
                <div className="service-image-box">
                    <img className="service-image" src={imgUrl} alt="service" />
                </div>
                <h3 className="service-title">{title}</h3>
            </Link>
            <Button className="add-cart-button" onClick={(e) => HandleAddToCart(e)}>
                Thêm vào giỏ hàng
                <BsArrowRight size={24} />
            </Button>
        </div>
    );
};

ServiceItem.propTypes = {
    title: PropTypes.string,
    imgUrl: PropTypes.string,
    onClick: PropTypes.func,
};
