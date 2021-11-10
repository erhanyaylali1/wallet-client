import { createSlice } from '@reduxjs/toolkit';

export const generalSlice = createSlice({
    name: 'general',
    initialState: {
        reload: false,
        loading: false,
        language: "en",
    },
    reducers: {
        setReload: (state) => {
            state.reload = !state.reload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
            localStorage.setItem("language", action.payload)
        }
    },
});

export const { setReload, setLoading, setLanguage } = generalSlice.actions;
export const getIsReload = (state) => state.general.reload;
export const getIsLoading = (state) => state.general.loading;
export const getLanguage = (state) => state.general.language;
export default generalSlice.reducer;