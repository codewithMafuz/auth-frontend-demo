// toastSlice.ts
import { createSlice } from '@reduxjs/toolkit';

export const toastSlice = createSlice({
    name: 'toast',

    initialState: {
        lastRenderedMs: 0,
        content: '',
        toastContainerOptions: {
            type: 'error',
            toastClassName: 'mt-[10vh]',
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            delay: 0,
        }
    },
    reducers: {
        setToastContent: (state, action) => {
            console.log('setting up new content', action.payload)
            state.lastRenderedMs = Date.now();
            state.content = action.payload;
        },
        setToastContainerOptions: (state, action) => {
            state.toastContainerOptions = { ...state.toastContainerOptions, ...action.payload };
        },
        reRenderToast: (state) => {
            if (Date.now() > (state.lastRenderedMs + 5000)) {
                state.lastRenderedMs = Date.now()
            }
        },
        setLastRenderedToast: (state) => {
            state.lastRenderedMs = Date.now()
        }
    }
});

export const { setToastContent, setToastContainerOptions, reRenderToast, setLastRenderedToast } = toastSlice.actions;

export default toastSlice.reducer;
