import axios from 'axios';
import { store } from '~/utils/store/store';
const BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: BASE_URL,
    // headers: {
    //     'content-type': 'application/json',
    // },
});
api.interceptors.request.use(function (config) {
    const state = store.getState().auth.login?.currenUser;

    if (state) {
        const accessToken = state.accessToken;
        config.headers.authorization = `Bearer ${accessToken}`;
    }

    return config;
});
export default api;
export { BASE_URL };
