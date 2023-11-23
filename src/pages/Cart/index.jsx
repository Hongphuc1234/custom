import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import classNames from 'classnames/bind';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import styles from './Cart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from '~/utils/api/axios';
import { removeToCart, addToCart } from '~/utils/store/authSlice';
import { useNavigate } from 'react-router-dom';

import avatarDefault from '~/assets/images/avatarDefault.jpg';
const cx = classNames.bind(styles);

function Cart() {
    const navigate = useNavigate();
    const [jsonData, setJsonData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalPriceBegin, setTotalPriceBegin] = useState(0);
    const [address , setAddress] = useState('')
    const user = useSelector((state) => state.auth.login?.currenUser);
    const [name ,setName] = useState(user.name)
    const [phone , setPhone] = useState(user.phone)
    const dispatch = useDispatch();
    const deleteElement = (index, id) => {
        axios
            .post(`/booking/deleteDetail`, {
                serviceID: id,
                phone: user.phone,
            })
            .then(() => {
                dispatch(addToCart(-1));
                toast.success('Bạn đã xóa dịch vụ thành công', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
            .catch((error) => console.log(error));
        const updatedElements = [...jsonData];
        updatedElements.splice(index, 1);
        setJsonData(updatedElements);
    };

    

    useEffect(() => {
        if (user) {
            axios
                .post(`/booking/listCart`, {
                    serviceID: 1,
                    phone: user.phone,
                })
                .then((res) => {
                    const cart = res.data;
                    console.log(cart);
                    setJsonData(cart);
                })
                .catch((error) => console.log(error));

                
       
        

        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleAddressChange = (e)=>{
        setAddress(e.target.value)
    }
    const handleName=(e)=>{
        setName(e.target.value);
    }
    const handlePhone=(e)=>{
        setPhone(e.target.value);
    }
    useEffect(() => {
        const newTotalPrice = jsonData.reduce((total, element) => total + element.price, 0);
        setTotalPrice(newTotalPrice);
        setTotalPriceBegin(newTotalPrice);
    }, [jsonData]);

    const [active, setActive] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
        } else {
            if (address && phone && name) {
                if (isChecked) {
                    axios
                        .post(`/checkout/create-payment`, {
                            address: address,
                            name : name,
                            phone : phone,
                            totalPrice: totalPrice,
                            user:user.phone,
                            bankCode: 'NCB',
                        })
                        .then((res) => {
                            dispatch(removeToCart());
                            console.log(res.data.url)
                            toast.success('Bạn đã đặt hàng thành công', {
                                position: toast.POSITION.TOP_RIGHT,
                            });
                            window.location.href = res.data.url;
                        });
                } else {
                    axios
                        .post(`/booking/book`, {
                            address:address,
                            name :name,
                            phone :phone,
                            totalPrice: totalPrice,
                            user:user.phone, 
                            bankCode: 'NCB',
                        })
                        .then((res) => {
                           if(res.data==='ss'){ 
                            dispatch(removeToCart());
                            toast.success('Bạn đã đặt hàng thành công', {
                                position: toast.POSITION.TOP_RIGHT,
                                
                            });
                            navigate('/')}
                            else {
                                
                                toast.error('bạn còn đơn hàng chưa được xác nhận', {
                                    position: toast.POSITION.TOP_RIGHT,
                                    
                                });
                            }
                        });
                }
            } else {
                toast.error('Vui lòng chọn đầy đủ các mục !!!', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }
        }
    };


    const [isChecked, setIsChecked] = useState(false);
   
    const position = [15.977456962147246, 108.2627979201717];
    let defaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconAnchor: [16, 37],
    });

    L.Marker.prototype.options.icon = defaultIcon;

    return (
        <div>
            {jsonData.length === 0 || !user ? (
                <h1>Bạn chưa đặt sản phẩm!</h1>
            ) : (
                <>
                    <h1>Giỏ Hàng</h1>
                    <table className={cx('table-element')}>
                        <tbody>
                            {jsonData.map((element, index) => (
                                <tr key={index}>
                                    <th className={cx('imgaes')}>
                                        <img src={element.img} alt="abc" />
                                    </th>
                                    <th>
                                        <h2>{element.tittle}</h2>

                                        <div> {element.name}</div>
                                    </th>
                                    <th>{element.price.toLocaleString('en-US')} VNĐ</th>
                                    <th>
                                        <div
                                            onClick={() => deleteElement(index, element.id)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                        </div>
                                    </th>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={cx('booking-service')}>
                        <div className={cx('booking-information')}>
                            <h3>ĐẶT LỊCH</h3>
                            <div className={cx('branch-staff-booking')}>
                                <p className={cx('branch-title')}>Địa chỉ (*):</p>
                                <input className={cx('se')} onChange={(e)=>handleAddressChange(e)}/>
                                    
                            </div>
                            <div className={cx('branch-staff-booking')}>
                                <p>Tên người đặt hàng (*):</p>
                                <input className={cx('se')} value={name} onChange={(e)=>handleName(e)} />
                            </div>
                            <div className={cx('branch-staff-booking')}>
                                <p>Số điện thoại(*):</p>
                                <input className={cx('se')} value={phone} onChange={(e)=>handlePhone(e)}/>
                            </div>
                            <div className={cx('date-booking')}>

                                <div className="checkbox-">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value=""
                                            id="flexCheckDisabled"
                                            onChange={() => setIsChecked((prev) => !prev)}
                                        />
                                        <label className="form-check-label" htmlFor="flexCheckDisabled">
                                            Thanh toán Online
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('total-price')}>
                                <p className={cx('total-price-title')}>Tổng tiền:</p>{' '}
                                <span>{totalPrice.toLocaleString('en-US')}</span> VNĐ
                               
                            </div>
                            
                            <button  className={cx('submit-booking')} type="submit" onClick={handleSubmit}>
                                ĐẶT LỊCH
                            </button>
                            
                        </div>
                        
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
