import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserLoginMutation } from '../../../../services/api';
import { checkValidation } from '../../../../services/validation-help';
import { setToken } from '../../../../services/tokenServices';
import SpinnerLoading from '../../../common/Spinner';
import { useDispatch } from 'react-redux';
import { setUserToken } from '../../../../rootSlice';
import { setToastContainerOptions, setToastContent } from '../../../../toastSlice';
import { isBothObjectSame } from '../../../../services/commonFunctions';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import CheckLoggedIn from '../../../../services/CheckLoggedIn';
import { setUserInfo } from '../../userSlice';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [validationErrorMsg, setValidationErrorMsg] = useState<string | boolean>(false)
    const [serverMsg, setServerMsg] = useState<string | boolean>(false)
    const msgToShow = serverMsg ? serverMsg : validationErrorMsg
    const [msgShowType, setMsgShowType] = useState<'error' | 'success' | 'info'>('error')
    const msg = { content: msgToShow, msgType: msgShowType, msgRenderedTime: 0 }

    const [submitDisability, setSubmitDisability] = useState<boolean>(true)
    const [prevSubmit, setPrevSubmit] = useState({})

    const [login, { isLoading }] = useUserLoginMutation();

    useEffect(() => {
        if (msg.content) {
            dispatch(setToastContainerOptions({ type: msg.msgType }))
            dispatch(setToastContent(msg.content))
        }

    }, [JSON.stringify(msg)])

    useEffect(() => {
        setPrevSubmit({})
        setSubmitDisability(((email.length > 10 && password.length > 8) && !isLoading) ? false : true)
    }, [email, password])

    const handleLogin = async (ev: React.SyntheticEvent) => {
        try {


            ev.preventDefault();
            setSubmitDisability(true)
            const formData = new FormData(ev.target as HTMLFormElement | undefined);
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;
            const { errors: validationErrors } = checkValidation({
                email: email,
                password: password,
            });
            if (validationErrors) {
                setValidationErrorMsg('could not find account, invalid credentials')
                return
                // login page still have some problem, like not submitting like that, not showing alert too
            }
            const toSubmit = { email, password }
            if (isBothObjectSame(prevSubmit, toSubmit)) {
                setSubmitDisability(true)
                return
            } else {
                setPrevSubmit(toSubmit)
            }
            const response: any = await login(toSubmit)
            setPrevSubmit(toSubmit)
            const { data, error } = response
            // console.log(data)
            const token = data?.data?.token
            if (!error && token) {
                dispatch(setUserToken(token))
                setToken(token)
                setMsgShowType('success')
                setServerMsg(data.message)
                navigate('/me')
            } else {
                setServerMsg(data?.message || 'could not login, try again')
            }

        } catch (error) {
            // console.log(error)
            setServerMsg('could not find account, invalid credentials')
        } finally {
            setSubmitDisability(false)
        }
    }


    return (
        <div className='flex min-h-screen flex-1 flex-col justify-center px-6 py-6 lg:px-8'>
            <CheckLoggedIn actionOnIfLoggedIn={(user) => {
                const { name, email, _id, profilePath } = user
                dispatch(setUserInfo({ name, email, _id, profilePath }))
                navigate('/me')
            }} />
            <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                <h2 className='mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Login</h2>
            </div>

            <div className='mt-5 sm:mx-auto sm:w-full sm:max-w-sm'>
                <form
                    onSubmit={(ev) => {
                        setSubmitDisability(true)
                        handleLogin(ev)
                    }} className='space-y-12' method='POST'>
                    <div className='fields space-y-3'>
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium leading-4 text-gray-900'>
                                Email address
                            </label>
                            <div className='mt-2'>
                                <input
                                    onChange={(ev) => {
                                        setEmail(ev.target.value.trim());
                                        setValidationErrorMsg(false)
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
                                        setValidationErrorMsg(false)
                                    }}
                                    value={password}
                                    id='password'
                                    name='password'
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete='current-password'
                                    required
                                    className='focus:outline-[1px] focus:outline-gray-200 pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
                                />

                                {showPassword ?
                                    <FiEye
                                        onClick={() => {
                                            setShowPassword(!showPassword);
                                        }}
                                        title={(showPassword ? 'hide' : 'show') + ' password'}
                                        className='cursor-pointer absolute top-2 right-2 text-blue-500'
                                    /> :
                                    <FiEyeOff
                                        onClick={() => {
                                            setShowPassword(!showPassword);
                                        }}
                                        title={(showPassword ? 'hide' : 'show') + ' password'}
                                        className='cursor-pointer absolute top-2 right-2 text-blue-500'
                                    />}


                            </div>
                        </div>

                        <p className='justify-self-start mt-10 text-center text-sm text-gray-500'>
                            <a href="/helps/terms" className='text-indigo-500 underline px-4' target='_blank'>Show terms and services</a>
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

                    <div className='relative'>
                        <button disabled={isLoading || submitDisability} type='submit' className={'fabsolute right-5 top-1.5 lex w-full justify-center rounded-m px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' + (!submitDisability ? 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-500' : 'bg-indigo-500 cursor-not-allowed')}>
                            Login
                            {isLoading && <SpinnerLoading classnames='absolute right-1 top-1' size='1.7rem' />}
                        </button>
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
