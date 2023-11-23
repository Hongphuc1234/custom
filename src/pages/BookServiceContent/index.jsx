import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ToastContainer, toast } from 'react-toastify';
import { Breadcrumbs } from '~/pages/Breadcrumbs';
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import './BookServiceContent.css';
import staffNghia from '~/assets/images/avatarDefault.jpg';
import staffLuong from '~/assets/images/avatarDefault.jpg';
import staffdube from '~/assets/images/avatarDefault.jpg';

function BookServiceContent() {
    const [branches] = useState([
        {
            id: 1,
            address: 'Khu đô thị FPT, Ngũ Hành Sơn, TP Đà Nẵng',
            position: '15.977456962147246, 108.2627979201717',
        },
        {
            id: 2,
            address: '123 Phạm Như Xương, Liên Chiểu, TP Đà Nẵng',
            position: '16.06456047137082, 108.15191449651242',
        },
        {
            id: 3,
            address: '36 Trần Văn Ơn, TP Huế, Thừa Thiên Huế',
            position: '16.465680902969627, 107.60516250808173',
        },
        {
            id: 4,
            address: '150 Trần Thánh Tông, Hội An, Quảng Nam',
            position: '15.888565750138024, 108.34642808301683',
        },
        {
            id: 5,
            address: 'Thị trấn Chợ Chùa, Quảng Ngãi',
            position: '15.03934538342154, 108.77545294091901',
        },
    ]);

    const [dates, setDates] = useState([]);

    const handleClick = (daysToAdd) => {
        return new Promise((resolve) => {
            const nextDay = moment().add(daysToAdd, 'days').format('DD/MM');
            console.log('Next day:', nextDay);
            // Thực hiện các hành động khác với nextDay
            resolve(nextDay);
        });
    };

    useEffect(() => {
        const fetchDates = async () => {
            const promises = [0, 1, 2, 3, 4, 5, 6].map((daysToAdd) => handleClick(daysToAdd));
            const updatedDates = await Promise.all(promises).then((results) =>
                results.map((date, index) => ({ id: index + 1, date })),
            );
            setDates(updatedDates);
        };

        fetchDates();
    }, []);

    const [times] = useState([
        // '8:00', '9:30', '11:00', '13:00', '14:30', '16:00'
        {
            id: 1,
            time: '8:00',
        },
        {
            id: 2,
            time: '9:30',
        },
        {
            id: 3,
            time: '11:00',
        },
        {
            id: 4,
            time: '13:00',
        },
        {
            id: 5,
            time: '14:30',
        },
        {
            id: 6,
            time: '16:00',
        },
    ]);

    const [staffs] = useState([
        {
            id: 1,
            name: 'Lê Quý Nghĩa',
            avatar: staffNghia,
            position: 'Salon staff',
            phone: '0969140342',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        },
        {
            id: 2,
            name: 'Ngô Anh Lượng',
            avatar: staffLuong,
            position: 'Salon staff',
            phone: '0123456789',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        },
        {
            id: 3,
            name: 'Hoàng Hồng Phúc',
            avatar: staffdube,
            position: 'Salon staff',
            phone: '0123456789',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        },
        {
            id: 4,
            name: 'Nguyễn Hữu Phước',
            avatar: staffdube,
            position: 'Salon staff',
            phone: '0123456789',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        },
    ]);

    const [active, setActive] = useState(false);
    // const [center, setCenter] = useState(null);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [selectedTimeId, setSelectedTimeId] = useState(null);
    const [selectedDateId, setSelectedDateId] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const handleSelectChange = (event) => {
        const selectID = parseInt(event.target.value);
        const selected = staffs.find((staff) => staff.id === selectID);
        setSelectedStaff(selected);
        if (selectID !== 0) {
            setActive(true);
        } else {
            setActive(false);
        }
    };

    const handleBranchesChange = (event) => {
        const selectedID = parseInt(event.target.value);
        const selected = branches.find((branch) => branch.id === selectedID);
        setSelectedBranchId(selected)
    };
    const handleDateClick = (id) => {
        setSelectedDateId(id);
    };
    const handleTimesClick = (id) => {
        setSelectedTimeId(id);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedBranchId && selectedStaff && selectedDateId && selectedTimeId) {
            toast.success('Bạn đã đặt lịch thành công', {
                position: toast.POSITION.TOP_RIGHT,
            });
        } else {
            toast.error('Vui lòng chọn đầy đủ các mục !!!', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const position = [15.977456962147246, 108.2627979201717];
    let defaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconAnchor: [16, 37],
    });

    L.Marker.prototype.options.icon = defaultIcon;

    return (
        <div className="grid">
            <section
                className="header"
                style={{
                    '--bg-url': `url(${'https://theme.hstatic.net/1000181446/1000235350/14/image_breadcrumb_bg.png?v=1737'})`
                }}
            >
                <h1 className="heading">CÁC DỊCH VỤ</h1>
                <Breadcrumbs className="breadcrumbs">
                    <Link className="breadcrumb-link" to='/'>
                        Trang chủ
                    </Link>
                    <Link className="breadcrumb-link" to='/service'>
                        Các dịch vụ
                    </Link>
                </Breadcrumbs>
            </section>
            <div className="grid">
                <div className="grid-row book-service-content">
                    <div className="grid-col-6 book-service">
                        <h3 className="service-name">ĐẶT LỊCH</h3>
                        <div className="branch">
                            <p>Chọn salon (*):</p>
                            {/* <div className="branch-add grid-row">
                                {branches.map((branch) => (
                                    <button
                                        className={`branch-item grid-col-3 ${
                                            branch.id === selectedBranchId ? 'selected' : ''
                                        }`}
                                        key={branch.id}
                                        onClick={() => handleBranchesClick(branch.id)}
                                    >
                                        {branch.address}
                                    </button>
                                ))}
                            </div> */}
                            <select className="branch-select" onChange={handleBranchesChange}>
                                <option value="0">- Vui lòng chọn chi nhánh -</option>
                                {branches.map((branch) => (
                                    <option
                                        key={branch.id} value={branch.id}
                                        // onClick={() => handleBranchesClick(branch.id)}
                                    >
                                        {branch.address}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="staff">
                            <p>Chọn nhân viên (*):</p>
                            <select className="staff-select" onChange={handleSelectChange}>
                                <option value="0">- Vui lòng chọn nhân viên -</option>
                                {staffs.map((staff) => (
                                    <option className="" key={staff.id} value={staff.id}>
                                        {staff.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="book-date-time">
                            <p>Chọn ngày (*):</p>
                            <div className="date-booking grid-row">
                                {dates.map((date) => (
                                    <>
                                        {active !== true ? (
                                            <button disabled className="grid-col date-booking-item" key={date.id}>
                                                {date.date}
                                            </button>
                                        ) : (
                                            <button
                                                className={`date-booking-item booking-active grid-col ${
                                                    date.id === selectedDateId ? 'selected' : ''
                                                }`}
                                                key={date.id}
                                                onClick={() => handleDateClick(date.id)}
                                            >
                                                {date.date}
                                            </button>
                                        )}
                                    </>
                                ))}
                            </div>
                            <p>Chọn giờ (*):</p>
                            <p className="time-status">
                                <div className="time-selected">
                                    <div
                                        className="time-selected-color"
                                        style={{ width: '15px', height: '15px', marginRight: '7px' }}
                                    ></div>
                                    <span className="status-name">Đã chọn</span>
                                </div>
                                <div className="time-still">
                                    <div
                                        className="time-still-color"
                                        style={{ width: '15px', height: '15px', marginRight: '7px' }}
                                    ></div>
                                    <span className="status-name">Chưa chọn</span>
                                </div>
                                <div className="time-out">
                                    <div
                                        className="time-out-color"
                                        style={{ width: '15px', height: '15px', marginRight: '7px' }}
                                    ></div>
                                    <span className="status-name">Hết chỗ</span>
                                </div>
                            </p>
                            <div className="time-booking grid-row">
                                {times.map((data) => (
                                    <>
                                        {active !== true ? (
                                            <button disabled className="time-booking-item grid-col" key={data.id}>
                                                {data.time}
                                            </button>
                                        ) : (
                                            <button
                                                className={`time-booking-item booking-active grid-col ${
                                                    data.id === selectedTimeId ? 'selected' : ''
                                                }`}
                                                key={data.id}
                                                onClick={() => handleTimesClick(data.id)}
                                            >
                                                {data.time}
                                            </button>
                                        )}
                                    </>
                                ))}
                            </div>
                        </div>
                        <button className="submit" type="submit" onClick={handleSubmit}>
                            ĐẶT LỊCH
                        </button>
                        <ToastContainer />
                    </div>
                    <div className="grid-col-6 service-info">
                        <div className="staff-info">
                            <h3 className="staff-info-content">THÔNG TIN NHÂN VIÊN BẠN ĐÃ CHỌN</h3>
                            {selectedStaff && (
                                <div className="staff-items">
                                    <img className="staff-image" src={selectedStaff.avatar} alt="avatar" />
                                    <div className="staff-item-content">
                                        <p className="staff-item-info">
                                            <strong className="staff-name">{selectedStaff.name}</strong> -{' '}
                                            {selectedStaff.position}
                                        </p>
                                        <p>{selectedStaff.description}</p>
                                        <p>Số điện thoại: {selectedStaff.phone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <MapContainer
                            center={position}
                            zoom={15}
                            scrollWheelZoom={false}
                            style={{ height: '254px', width: '100%'}}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={position}>
                                <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookServiceContent;
