import React, { useEffect, useState } from 'react';
import { useUserForgotPasswordMutation } from '../../../../services/api';
import { checkValidation } from '../../../../services/validation-help';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToastContainerOptions, setToastContent } from '../../../../toastSlice';
import CheckLoggedIn from '../../../../services/CheckLoggedIn';
import { setUserInfo } from '../../userSlice';

const ForgetPassword: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState<any>({ content: '', msgType: 'error', msgRenderedTime: 0 })



    const [forgotpassword, { isLoading, isError }] = useUserForgotPasswordMutation();
    const [prevEmail, setPrevEmail] = useState<string>('')

    useEffect(() => {
        if (msg.content) {
            dispatch(setToastContainerOptions({ type: msg.msgType }))
            dispatch(setToastContent(msg.content))
        }

    }, [JSON.stringify(msg)])

    useEffect(() => {
        if (email.trim().length > 10) {
            setPrevEmail('')
        }
    }, [email])

    const handleForgetPasswordEmail = async (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        const formData = new FormData(ev.target as HTMLFormElement | undefined);
        const email = formData.get('email') as string;
        const { errors } = checkValidation({
            email: email,
        });

        if (errors) {
            setMsg((prev: any) => ({
                ...prev, msgRenderedTime: Date.now(), content: 'Invalid - ' + Object.keys(errors).join(', '), msgType: "error"
            }));
            return;
        }
        try {
            if (email !== prevEmail) {
                setPrevEmail(email)
                const response: any = await forgotpassword({ email: email.trim() });
                // console.log(response)
                const { status, message } = response.data;
                if (status === 'Failed') {
                    setMsg((prev: any) => ({
                        ...prev, msgRenderedTime: Date.now(), content: message, msgType: "error"
                    }));
                    return;
                }
                setMsg((prev: any) => ({
                    ...prev, msgRenderedTime: Date.now(), content: 'Check your email, we have sent an reset password link to your email', msgType: "success"
                }));
            }
        } catch (error) {
            setMsg((prev: any) => ({
                ...prev, msgRenderedTime: Date.now(), content: 'Failed', msgType: "error"
            }));

        }
    };

    if (isError) {
        // console.log('isError triggered');
    }

    return (
        <div className='flex min-h-screen flex-1 flex-col justify-center px-6 py-6 lg:px-8'>
            <CheckLoggedIn actionOnIfLoggedIn={(user) => {
                const { name, email, _id, profilePath } = user
                dispatch(setUserInfo({ name, email, _id, profilePath }))
                navigate('/me')
            }} />

            <div className='sm:mx-auto sm:w-full sm:max-w-sm'>

                <h2 className='mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Forget Password</h2>
            </div>

            <div className='mt-5 sm:mx-auto sm:w-full sm:max-w-sm'>
                <form onSubmit={handleForgetPasswordEmail} className='space-y-12' method='POST'>
                    <div className='fields space-y-3'>
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium leading-4 text-gray-900'>
                                Your Email address
                                <br />
                                (we will sent a link to recover your account)
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
                    </div>
                    <div className='font-bold h-[50px] flex flex-1 items-center justify-center'>
                    </div>
                    <div className='flex justify-between'>
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
                        <a
                            href='/'
                            onClick={(ev) => {
                                ev.preventDefault();
                                navigate('/auth/signup');
                            }}
                            className='underline font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
                        >
                            Signup
                        </a>
                    </div>
                    <div className='relative'>
                        <button disabled={prevEmail === email} type='submit' className='fabsolute right-5 top-1.5 lex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                            Send Reset Password link
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

export default ForgetPassword;
