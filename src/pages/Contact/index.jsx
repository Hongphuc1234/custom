import { Breadcrumbs as BreadcrumbsComponent } from '~/pages/Breadcrumbs';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useState } from 'react';
import { useEffect } from 'react';
import Branch from './Branch';
import axios from '~/utils/api/axios';

const Contact = () => {
    const [branchList, setBranchList] = useState([]);

    useEffect(() => {
        // Gọi API để lấy danh sách chi nhánh
        axios
            .get(`branch`)
            .then((response) => {
                setBranchList(response.data);
            })
            .catch((error) => {
                console.error('Error fetching branch data:', error);
            });
    }, []);

    return (
        <Wrapper>
            <Header>
                <Heading>LIÊN HỆ</Heading>
                <Breadcrumbs>
                    <BreadcrumbItem className="breadcrumb-link" to="/">
                        Trang chủ{' '}
                    </BreadcrumbItem>
                    <BreadcrumbItem className="breadcrumb-link" to="/contact">
                        {' '}
                        Liên hệ
                    </BreadcrumbItem>
                </Breadcrumbs>
            </Header>
            <Body>
                <BranchBox>
                    <BranchHeading>CHUỖI SALONSPACE</BranchHeading>
                    <BranchList>
                        {branchList.map((branch) => (
                            <Branch {...branch} />
                        ))}
                    </BranchList>
                </BranchBox>
            </Body>
        </Wrapper>
    );
};

const Heading = styled.div({
    color: '#fff',
    fontSize: '30px',
    fontWeight: 800,
});

const Wrapper = styled.div({
    width: '100%',
});

const Header = styled.section({
    background: `url(https://theme.hstatic.net/1000181446/1000235350/14/image_breadcrumb_bg.png?v=1737) no-repeat top center`,
    aspectRatio: '4/3',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',

    '@media (min-width: 768px)': {
        aspectRatio: 'initial',
        height: '300px',
    },
});

const Breadcrumbs = styled(BreadcrumbsComponent)`
    color: #fff;
    margin-top: 14px;
`;

const BreadcrumbItem = styled(Link)`
    text-decoration: none;
    color: #fff;
    font-size: 16px;

    &:hover {
        color: white;
    }
`;

const Body = styled.section({
    padding: '50px 15px',
    '@media (min-width: 768px)': {
        padding: '50px 30px',
    },
});

const BranchBox = styled.div({
    padding: '15px',
    backgroundColor: '#fbfbf1',
    maxWidth: '1140px',
    marginInline: 'auto',
    border: '1px solid #000',
});

const BranchHeading = styled.h2({
    fontSize: '20px',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: '15px',
    marginBottom: '30px',
});

const BranchList = styled.div({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',

    '@media (min-width: 1024px)': {
        gridTemplateColumns: '1fr 1fr 1fr',
    },
});

export default Contact;
