// App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { setUserToken } from './rootSlice';
import { getToken } from './services/tokenServices';
import Home from './components/pages/auth/home/Home';
import Login from './components/pages/auth/login/Login';
import ForgetPassword from './components/pages/auth/forgetPassword/ForgetPassword';
import ResetPassword from './components/pages/auth/resetPassword/ResetPassword';
import Signup from './components/pages/auth/signup/Signup';
import Me from './components/pages/me/Me';
import Terms from './components/pages/helps/Terms';
import Dashboard from './components/pages/me/dashboard/Dashboard';
import Settings from './components/pages/me/settings/Settings';
import SignupComplete from './components/pages/auth/signupComplet/SignupComplete';
import Sidebar from './components/pages/me/Sidebar';
import "react-toastify/dist/ReactToastify.min.css";
import PageNotFound from './components/pages/PageNotFound';


export default function App() {
    const dispatch = useDispatch();
    const token = getToken();

    useEffect(() => {
        if (token) {
            dispatch(setUserToken(token));
        }
    }, [token]);

    const { lastRenderedMs, content, toastContainerOptions } = useSelector((state: any) => state.toast);
    useEffect(() => {
        if (content) {
            toast(content.trim(), {
                type: toastContainerOptions.type
            });
        }
    }, [content, lastRenderedMs]);

    return (
        <Router>
            <ToastContainer {...toastContainerOptions} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<Signup />} />
                <Route path="/auth/forgot-password" element={<ForgetPassword />} />
                <Route path="/auth/reset-password/:id/:token" element={<ResetPassword />} />
                <Route path="/auth/complete-signup/:id/:token" element={<SignupComplete />} />

                <Route path='/me' element={<Sidebar />}>
                    <Route index element={<Me />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
                <Route path='/helps/terms' element={<Terms />} />

                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </Router>
    );
}
