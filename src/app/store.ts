import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { userApi } from '../services/api';
import signupSlice from '../components/pages/auth/signup/signupSlice';

export const store = configureStore({
    reducer: {
        signup : signupSlice,
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
