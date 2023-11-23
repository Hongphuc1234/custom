import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { InputBase } from '@mui/material';
import { useRef } from 'react';
import axios from '~/utils/api/axios';

export default function CustomizedInputBase({ onSearch }) {
    const searchRef = useRef(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        const searchValue = searchRef.current.value.trim();

        if (searchValue === '') {
            // Call the API to retrieve all services when search input is empty
            axios
                .get(`/service`)
                .then((response) => {
                    // Call the `onSearch` function with the API response data
                    onSearch(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        } else {
            // Call the API to search for services based on the provided search term
            axios
                .get(`/service/search?search=${searchValue}`)
                .then((response) => {
                    // Call the `onSearch` function with the API response data
                    onSearch(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    };
    return (
        <Paper
            component="form"
            sx={{
                py: '8px',
                pl: '16px',
                pr: '8px',
                margin: '40px 0',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                display: 'flex',
                border: '2px solid #333',
                borderRadius: 0,
            }}
            onSubmit={(e) => handleSubmit(e)}
        >
            <InputBase
                inputRef={searchRef}
                sx={{ ml: 1, flex: 1 }}
                style={{ fontSize: '18px', color: '#333', width: '100%' }}
                placeholder="Tìm kiếm"
            />
            <IconButton type="button" aria-label="search" onClick={(e) => handleSubmit(e)}>
                <SearchIcon style={{ fontSize: '28px', color: '#333' }} />
            </IconButton>
        </Paper>
    );
}
