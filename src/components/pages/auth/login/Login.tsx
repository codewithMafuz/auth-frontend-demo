import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../app/hooks';
import { useUserLoginMutation } from '../../../../services/api';
import { checkValidation } from '../../../../services/validation-help';
import { setToken } from '../../../../services/tokenServices';
import { Alert } from '@material-tailwind/react';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const signupEmail: null | string = useAppSelector((state) => state.signup.signupEmail);

    const [email, setEmail] = useState(signupEmail ? signupEmail : '');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<boolean | string>(false);

    const [login, { isLoading, isError }] = useUserLoginMutation();
    const [serverResponseError, setServerResponseError] = useState(false);

    const handleLogin = async (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        const formData = new FormData(ev.target as HTMLFormElement | undefined);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const rememberMe: boolean = formData.get('rememberMe') === 'on';
        const { errors } = checkValidation({
            email: email,
            password: password,
        });

        if (errors) {
            setError('Invalid - ' + Object.keys(errors).join(', '));
            return;
        }
        try {
            const response: any = await login({ email, password, rememberMe });
            const { data, status, message } = response.data;
            if (status.toLowerCase() === 'failed') {
                setServerResponseError(message);
                return;
            }
            setError(false);
            setServerResponseError(false);
            if (data.token) {
                setToken(data.token);
                navigate('/me/dashboard');
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    if (isError) {
        console.log('isError triggered');
    }

    return (
        <div className='flex min-h-screen flex-1 flex-col justify-center px-6 py-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                <h2 className='mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Login</h2>
            </div>

            <div className='mt-5 sm:mx-auto sm:w-full sm:max-w-sm'>
                <form onSubmit={handleLogin} className='space-y-12' method='POST'>
                    <div className='fields space-y-3'>
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium leading-4 text-gray-900'>
                                Email address
                            </label>
                            <div className='mt-2'>
                                <input
                                    onChange={(ev) => {
                                        setEmail(ev.target.value.trim());
                                    }}
                                    value={email}
                                    id='email'
                                    name='email'
                                    type='email'
                                    autoComplete='email'
                                    required
                                    className='focus:outline-[1px] focus:outline-gray-200 pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
                                />
                            </div>
                        </div>
                        <div>
                            <div className='flex items-center justify-between'>
                                <label htmlFor='password' className='block text-sm font-medium leading-6 text-gray-900'>
                                    Password
                                </label>
                            </div>
                            <div className='mt-2 relative'>
                                <input
                                    onChange={(ev) => {
                                        setPassword(ev.target.value.trim());
                                    }}
                                    value={password}
                                    id='password'
                                    name='password'
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete='current-password'
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
                        </div>
                        <label htmlFor='rememberMe' className='select-none flex items-center justify-left ml-3 text-sm font-medium leading-6 text-gray-900'>
                            Remember me (recommended for quick login)
                            <input
                                onChange={() => {
                                    setRememberMe(!rememberMe);
                                }}
                                name='rememberMe'
                                id='rememberMe'
                                type='checkbox'
                                className='accent-green-600 ml-3'
                            />
                        </label>
                        <p className='justify-self-start mt-10 text-center text-sm text-gray-500'>
                            <a
                                href='/'
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    navigate('/auth/forgot-password');
                                }}
                                className='underline font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
                            >
                                Forgot password
                            </a>
                        </p>
                    </div>
                    <div className='font-bold h-[50px] flex flex-1 items-center justify-center'>{(serverResponseError || error) && <Alert className='text-red-500'>{serverResponseError || error}</Alert>}</div>

                    <div className='relative'>
                        <button type='submit' className='fabsolute right-5 top-1.5 lex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                            Login
                        </button>
                        {isLoading && (
                            <div className='absolute right-5 top-1.5 text-white inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]' role='status'>
                                <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>Loading...</span>
                            </div>
                        )}
                    </div>
                </form>
                <p className='mt-10 text-center text-sm text-gray-500 absolute bottom-5'>
                    Don't have an account?
                    <a
                        href='/'
                        onClick={(ev) => {
                            ev.preventDefault();
                            navigate('/auth/signup');
                        }}
                        className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
                    >
                        Signup
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
