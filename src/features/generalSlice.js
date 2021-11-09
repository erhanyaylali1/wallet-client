import { createSlice } from '@reduxjs/toolkit';

export const generalSlice = createSlice({
    name: 'user',
    initialState: {
        reload: false,
        loading: false
    },
    reducers: {
        setReload: (state) => {
            state.reload = !state.reload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    },
});

export const { setReload, setLoading } = generalSlice.actions;
export const getIsReload = (state) => state.general.reload;
export const getIsLoading = (state) => state.general.loading;
export default generalSlice.reducer;