import styled from '@emotion/styled';
import { MdLocationOn } from 'react-icons/md';
import { BiSolidPhone } from 'react-icons/bi';
import React from 'react';

const Branch = ({ address, phone }) => {
    return (
        <Wrapper>
            <Text>
                <LocationIcon />
                {address}
            </Text>
            <Text>
                <PhoneIcon />
                {phone}
            </Text>
        </Wrapper>
    );
};

const Wrapper = styled.div({
    backgroundColor: '#000',
    border: '1px solid #000',
    padding: '5px 15px',
    color: 'white',

    ':hover': {
        backgroundColor: '#fbfbf1',
        color: '#000',
        border: '1px solid #000',
        '> div': {
            color: '#000',
        },
    },
});

const Text = styled.div({
    display: 'grid',
    color: 'white',
    gridTemplateColumns: '20px 1fr',
});

const LocationIcon = styled(MdLocationOn)({
    transform: 'translateY(4px)',
});

const PhoneIcon = styled(BiSolidPhone)({
    transform: 'translateY(3px)',
});

export default Branch;
