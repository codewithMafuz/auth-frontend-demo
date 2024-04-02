import { createSlice } from '@reduxjs/toolkit';
import { getToken } from './services/tokenServices';

export const rootSlice = createSlice({
    name: 'root',
    initialState: {
        token: getToken(),
    },
    reducers: {
        setUserToken: (state, action) => {
            state.token = action.payload
        },

    }

},
);

export const { setUserToken, } = rootSlice.actions;

export default rootSlice.reducer;
