import { configureStore } from '@reduxjs/toolkit';
import generalSlice from '../features/generalSlice';
import userSlice from '../features/userSlice';

export default configureStore({
    reducer: {
        user: userSlice,
        general: generalSlice
    },
});