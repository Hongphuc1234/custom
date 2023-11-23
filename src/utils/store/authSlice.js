import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            currenUser: null,
            isFetching: false,
            error: false,
        },
        logout: {
            isFetching: false,
            error: false,
        },
        cart: 0,
        notification: 0,
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currenUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        logoutStart: (state) => {
            state.logout.isFetching = true;
        },
        logoutSuccess: (state) => {
            //  state.logout.isFetching = false;
            state.login.currenUser = null;
            //  state.logout.error = false;
        },
        logoutFailed: (state) => {
            state.login.isFetching = false;
            state.logout.error = true;
        },
        addToCart: (state, action) => {
            const quantity = action.payload;
            state.cart += quantity;
        },
        removeToCart: (state, action) => {
            state.cart = 0;
        },
        addToNotification: (state, action) => {
            const quantity = action.payload;
            state.notification += quantity;
        },
        removeToNotification: (state, action) => {
            state.notification = 0;
        },
    },
});

export const {
    loginStart,
    loginFailed,
    loginSuccess,
    logoutSuccess,
    logoutFailed,
    logoutStart,
    addToCart,
    removeToCart,
    addToNotification,
    removeToNotification,
} = authSlice.actions;

export default authSlice.reducer;
