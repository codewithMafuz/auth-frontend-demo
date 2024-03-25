import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: null,
        _id: '',
        name: '',
        headline: '',
    },
    reducers: {
        setUserInfo: (state, action) => {
            const updatable = action.payload
            state._id = updatable._id || ''
            state.name = updatable.name || ''
            state.headline = updatable.headline || ''
        },

    },
});

export const { setUserInfo } = userSlice.actions;

export default userSlice.reducer;
