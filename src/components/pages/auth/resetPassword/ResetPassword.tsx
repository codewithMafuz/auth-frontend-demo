import React, { useState } from 'react';
import { useUserResetPasswordMutation } from '../../../../services/api';
import { checkValidation } from '../../../../services/validation-help';
import { Alert } from '@material-tailwind/react';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const { id, token } = useParams();

    const [error, setError] = useState<any>();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState<any>();

    const [resetPassword, { isLoading, isError }] = useUserResetPasswordMutation();
    const [serverResponseError, setServerResponseError] = useState(false);

    const handleForgetPasswordEmail = async (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        const formData = new FormData(ev.target as HTMLFormElement | undefined);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const { errors } = checkValidation({
            password: password,
            confirmPassword: confirmPassword,
        });

        if (errors) {
            setError('Invalid - ' + Object.keys(errors).join(', '));
            return;
        }
        try {
            if (password.trim() !== confirmPassword.trim()) {
                return;
            }
            const userNewPasswordProps = {
                password: password.trim(),
                confirmPassword: confirmPassword.trim(),
            };
            const response: any = await resetPassword({ userNewPasswordProps, id, token });
            const { status, message } = response.data;
            if (status.toLowerCase() === 'failed') {
                setServerResponseError(message);
                return;
            }
            setError('password reset done');
            setTimeout(() => {
              navigate('/auth/login')
            }, 2000);
            setServerResponseError(false);
        } catch (error) {
            console.log('status', error);
        }
    };

    if (isError) {
        console.log('isError triggered');
    }

    return (
        <div className='flex min-h-screen flex-1 flex-col justify-center px-6 py-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                <img className='mx-auto h-10 w-auto' src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600' alt='Your Company' />
                <h2 className='mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Login</h2>
            </div>

            <div className='mt-5 sm:mx-auto sm:w-full sm:max-w-sm'>
                <form onSubmit={handleForgetPasswordEmail} className='space-y-12' method='POST'>
                    <div className='mt-2 relative'>
                        <input
                            onChange={(ev: any | React.SyntheticEvent) => {
                                setPassword(ev.target.value.trim());
                            }}
                            value={password}
                            id='password'
                            name='password'
                            type={showPassword ? 'text' : 'password'}
                            required
                            className='focus:outline-[1px] focus:outline-gray-200 pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
                        />
                        <i
                            onClick={() => {
                                setShowPassword(!showPassword);
                            }}
                            title={(showPassword ? 'hide' : 'show') + ' password'}
                            className={'cursor-pointer absolute top-2 right-2 text-blue-500 fa-solid fa-eye' + (showPassword ? '-slash' : '')}
                        ></i>
                    </div>
                    <div className='mt-2 relative'>
                        <input
                            onChange={(ev: any | React.SyntheticEvent) => {
                                setConfirmPassword(ev.target.value.trim());
                            }}
                            value={confirmPassword}
                            id='confirmPassword'
                            name='confirmPassword'
                            type={showPassword ? 'text' : 'password'}
                            required
                            className='focus:outline-[1px] focus:outline-gray-200 pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
                        />
                        <i
                            onClick={() => {
                                setShowPassword(!showPassword);
                            }}
                            title={(showPassword ? 'hide' : 'show') + ' password'}
                            className={'cursor-pointer absolute top-2 right-2 text-blue-500 fa-solid fa-eye' + (showPassword ? '-slash' : '')}
                        ></i>
                    </div>
                    <div className='font-bold h-[50px] flex flex-1 items-center justify-center'>
                        {(serverResponseError || error) && (
                            <Alert  className='text-red-500'>
                                {serverResponseError || error}
                            </Alert>
                        )}
                    </div>
                    <div className='flex justify-center'>
                        <a
                            href='/'
                            onClick={(ev) => {
                                ev.preventDefault();
                                navigate('/auth/login');
                            }}
                            className='underline font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
                        >
                            Login
                        </a>
                    </div>
                    <div className='relative'>
                        <button type='submit' className='fabsolute right-5 top-1.5 lex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                            Set Password
                        </button>
                        {isLoading && (
                            <div className='absolute right-5 top-1.5 text-white inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]' role='status'>
                                <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>Loading...</span>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
