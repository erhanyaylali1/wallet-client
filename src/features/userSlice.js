import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        userWallet: {
            data: [],
            history: [],
            totalAssets: 0,
        },
        isLogged: false
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isLogged = true;
        },
        logout: (state) => {
            state.user = null;
            state.isLogged = false;
            state.userWallet = {
                data: [],
                history: [],
                totalAssets: 0,
            };
        },
        setUserWallet: (state, action) => {
            state.userWallet = action.payload;
        }
    },
});

export const { login, logout, setUserWallet } = userSlice.actions;
export const getUser = (state) => state.user.user;
export const getUserWallet = (state) => state.user.userWallet;
export const getIsUserLogged = (state) => state.user.isLogged;
export default userSlice.reducer;