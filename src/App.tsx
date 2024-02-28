import Home from './components/pages/auth/home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/pages/auth/login/Login';
import ForgetPassword from './components/pages/auth/forgetPassword/ForgetPassword';
import ResetPassword from './components/pages/auth/resetPassword/ResetPassword';
import Signup from './components/pages/auth/signup/Signup';
import Dashboard from './components/pages/me/dashboard/Dashboard';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/auth/login' element={<Login />} />
                <Route path='/auth/signup' element={<Signup />} />
                <Route path='/auth/forgot-password' element={<ForgetPassword />} />
                <Route path='/auth/reset-password/:id/:token' element={<ResetPassword />} />

                <Route path='/me/dashboard' element={<Dashboard />} />
            </Routes>
        </Router>
    );
}
