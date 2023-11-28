import { useEffect, useMemo, useState } from 'react';
import { Button, useMediaQuery } from '@mui/material';
import { Breadcrumbs as BreadcrumbsComponent } from '../Breadcrumbs';
import Comments from '~/components/Comment/Comments';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '~/utils/api/axios';
import styled from '@emotion/styled';
import SlickSlider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { formatVNCurrency } from '~/utils/common';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { addToCart } from '~/utils/store/authSlice';
import { ServiceItem } from '~/pages/ServiceItem';
import '~/pages/ServiceDetail/detail.css';

function ServiceDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isMediumScreen = useMediaQuery('(min-width: 768px)');
    const isLargeScreen = useMediaQuery('(min-width: 1024px)');
    const isSmallScreen = !isLargeScreen && !isMediumScreen;
    const [serviceDetail, setServiceDetail] = useState(null);
    const[exlist,setExlist] =useState([])
    const sliderConfig = {
        arrows: false,
        rows: isSmallScreen ? 1 : 2,
        slidesPerRow: isSmallScreen ? 1 : 2,
        dots: false,
        autoplay: true,
    };

    const dispatch = useDispatch();
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

    const listImgs = useMemo(() => {
        const listImages = (serviceDetail?.imgDetails || []).map((item) => item.img);
        return listImages;
    }, [serviceDetail]);

    useEffect(() => {
        window.scrollTo(0, 0);
        axios
            .get(`/service/detail/${id}`)
            .then((response) => {
                console.log(response.data)
                setServiceDetail(response.data);
                const st =response.data;
                console.log(st.id);
                console.log(response.data.id)
                axios
                .get(`/service/detail1/${response.data.id}`)
                .then((response) => {
                    const newArray = response.data;
                    console.log(newArray)
                    console.log('-------------------------')
                  
                
                    setExlist(response.data);
                 
                })
                .catch((error) => {
                    console.error('Error fetching service detail:', error);
                });
            })
            .catch((error) => {
                console.error('Error fetching service detail:', error);
            });
    }, [id]);
    if (!serviceDetail) {
        return <div>Loading...</div>; // You can render a loading indicator while waiting for data to be fetched
    }

    return (
        <Container>
            <Wrapper>
                <Breadcrumbs separate={<Separate>/</Separate>}>
                    <BreadcrumbLink to="/">Trang chủ</BreadcrumbLink>
                    <BreadcrumbLink to="/service">Các dịch vụ</BreadcrumbLink>
                    <BreadcrumbLink>{serviceDetail.name}</BreadcrumbLink>
                </Breadcrumbs>
                <GridView>
                    <Header>
                        <Heading>{serviceDetail?.name}</Heading>
                        <SubHeading>{formatVNCurrency(+serviceDetail?.price)}</SubHeading>
                        {isLargeScreen && (
                            <Description>
                                <DesHeading>Mô tả</DesHeading>
                                <DesContent>{serviceDetail?.description}</DesContent>
                            </Description>
                        )}
                        <CartButton size="large" onClick={(e) => HandleAddToCart(e)}>
                            Thêm vào giỏ hàng
                        </CartButton>
                    </Header>
                    
                    <div className="slide" style={{width:"500px"}}>
                    <div className="imgdetail" style={{width:"100%"}}>
                            <img src={serviceDetail.img} alt="" style={{width:"80%", height:"400px"}}/>
                    </div>
                    <div className="imgnho" >
                        {listImgs?.map((imgDetail) => (
                            <img key={imgDetail?.id} src={imgDetail} style={{width:"20%",marginRight:"40px"}}/>
                        ))}
                        </div>
                    </div>
                    
                    {!isLargeScreen && (
                        <Description>
                            <DesHeading>Mô tả</DesHeading>
                            <DesContent>{serviceDetail?.description}</DesContent>
                        </Description>
                    )}
                    
                    <CommentBox>
                        <Comments serviceID={id} />
                    </CommentBox>
                </GridView>
                <div className="list"  >
                    {exlist?.map((ex) => (
                        ex.id !== id ?  (
                    <ServiceItem id={ex.id} imgUrl={ex.img} title={ex.name}  />  ):null  
                     ))}
                    </div>
            </Wrapper>
        </Container>
    );
}

const Container = styled.div({
    width: '100%',
    maxWidth: '1550px',
    marginInline: 'auto',
    paddingTop: '40px',
});

const Wrapper = styled.div({
    display: 'flex',
    flexDirection: 'column',

    '@media(min-width: 768px)': {
        marginInline: '15px',
    },

    '@media(min-width: 1024px)': {
        marginInline: '30px',
    },

    '@media(min-width: 1550px)': {
        marginInline: 0,
    },
});

const Breadcrumbs = styled(BreadcrumbsComponent)({
    marginInline: '15px',
    marginBottom: '20px',

    '@media(min-width: 768px)': {
        marginInline: 0,
    },
});

const BreadcrumbLink = styled(Link)({
    color: '#333',
    fontSize: '14px',
});


const Separate = styled.span({
    marginInline: '6px',
});

const GridView = styled.div({
    position: 'relative',
    gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
    columnGap: '40px',

    '@media(min-width: 1024px)': {
        display: 'grid',
        // marginInline: '30px',
    },
});

const Silder = styled(SlickSlider)({
    marginBottom: '30px',
    gridColumn: 'span 8 / span 8',
    gridColumnStart: 1,
    gridRowStart: 1,
});

const ImageSlide = styled.img({
    aspectRatio: '1/1',
    objectFit: 'cover',
});

const Header = styled.div({
    marginInline: '15px',
    marginBottom: '30px',
    gridColumn: 'span 4 / span 4',
    gridColumnStart: 9,
    gridRowStart: 1,

    '@media(min-width: 768px)': {
        marginInline: '0px',
    },
});

const Heading = styled.h1({
    fontWeight: 600,
    fontSize: '24px',
    marginBottom: 0,
    '@media(min-width: 1024px)': {
        fontSize: '32px',
        marginBottom: '10px',
    },
});

const SubHeading = styled.p({
    fontWeight: 600,
    fontSize: '18px',
    marginBottom: 0,

    '@media(min-width: 1024px)': {
        fontSize: '24px',
        marginBottom: '64px',
    },
});

const CartButton = styled(Button)({
    backgroundColor: '#000',
    borderRadius: 0,
    fontSize: '16px',
    fontWeight: 600,
    textTransform: 'none',
    color: '#fbfbf1',
    position: 'fixed',
    inset: 'auto 15px 15px 15px',
    zIndex: 10,
    paddingBlock: '14px',

    '&:hover': {
        backgroundColor: '#000',
    },

    '&:focus': {
        outline: 'none',
    },

    '@media(min-width: 1024px)': {
        position: 'initial',
        width: '100%',
    },
});

const Description = styled.div({
    marginInline: '15px',
    marginBottom: '30px',
    gridColumn: 'span 8 / span 8',

    '@media(min-width: 768px)': {
        marginInline: 0,
    },
});

const DesHeading = styled.h2({
    fontSize: '18px',
    fontWeight: 600,
});

const DesContent = styled.p({});

const CommentBox = styled.div({
    marginInline: '15px',
    gridColumn: 'span 8 / span 8',

    '@media(min-width: 768px)': {
        marginInline: 0,
    },
});

export default ServiceDetail;
