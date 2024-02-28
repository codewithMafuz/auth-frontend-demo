import React from 'react';
import { useNavigate } from 'react-router-dom';

const GetStartedBanner: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className='min-h-[90vh] flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-purple-800 text-white p-8 text-center  flex items-center'>
            <h1 className='text-4xl font-bold mb-4'>Get Started with Kareeara</h1>
            <p className='text-lg'>Start building and understanding beutiful career at Kareeara</p>
            <button
                onClick={() => {
                    navigate('/auth/login');
                }}
                className='text-lg text-light-100 bg-green-600 contained mt-4 transition-all text-gray-200 px-4 py-2 rounded-full hover:bg-green-800 hover:text-gray-100'
            >
                Get Started
            </button>
        </div>
    );
};

export default GetStartedBanner;
