import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { userApi } from '../services/api';
import settingSlice from '../components/pages/me/settings/settingSlice';
import rootSlice from '../rootSlice';
import toastSlice from '../toastSlice';
import userSlice from '../components/pages/userSlice';

export const store = configureStore({
    reducer: {
        root: rootSlice,
        toast: toastSlice,
        user: userSlice,
        setting: settingSlice,
        // apis
        [userApi.reducerPath]: userApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(userApi.middleware);
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
