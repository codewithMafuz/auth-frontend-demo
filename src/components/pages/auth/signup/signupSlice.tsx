import { createSlice } from '@reduxjs/toolkit';

export const signupSlice = createSlice({
    name: 'signup',
    initialState: {
        signupEmail: null,
    },
    reducers: {
        setSignupEmail: (state, action) => {
            state.signupEmail = action.payload;
        },
    },
});

export const { setSignupEmail } = signupSlice.actions;

export default signupSlice.reducer;
