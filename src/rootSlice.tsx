import { createSlice } from '@reduxjs/toolkit';

export const rootSlice = createSlice({
    name: 'root',
    initialState: {
        token: null,
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
