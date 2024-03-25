import { createSlice } from '@reduxjs/toolkit';

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        sidebarWidthPx: 300,
    },
    reducers: {
        changeSidebarWidthPx: (state, action) => {
            state.sidebarWidthPx = action.payload;
        },
    },
});

export const { changeSidebarWidthPx } = settingsSlice.actions;

export default settingsSlice.reducer;
