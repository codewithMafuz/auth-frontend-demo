import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        _id: null,
        name: null,
        headline: null,
        profilePath: null,
        profileSrc: null,
    },
    reducers: {
        setUserInfo: (state, action) => {
            const setObj = action.payload;
            const updatedState = { ...state };
            for (const prop in setObj) {
                if (setObj[prop] && (state[prop] !== setObj[prop])) {
                    updatedState[prop] = setObj[prop];
                }
            }
            return updatedState;
        },
        setUserId: (state, action) => {
            state._id = action.payload;
        },
    },
});

export const { setUserInfo, setUserId } = userSlice.actions;

export default userSlice.reducer;
