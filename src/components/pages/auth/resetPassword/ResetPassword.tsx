import React, { useEffect, useState } from 'react';
import { useUserResetPasswordMutation } from '../../../../services/api';
import { checkValidation } from '../../../../services/validation-help';
import { useNavigate, useParams } from 'react-router-dom';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { isBothObjectSame } from '../../../../services/commonFunctions';
import { setToastContainerOptions, setToastContent } from '../../../../toastSlice';
import { useDispatch } from 'react-redux';


const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const { id, token } = useParams();

    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState<any>('');
    const [prevSubmit, setPrevSubmit] = useState({})
    const [validationError, setValidationError] = useState('')
    const [serverMsg, setServerMsg] = useState('')
    const msgToShow = serverMsg || validationError
    const [msgShowType, setMsgShowType] = useState('error')
    const msg = { content: msgToShow, msgType: msgShowType, msgRenderedTime: 0 }


    const [resetPassword, { isLoading }] = useUserResetPasswordMutation();
    const [showSubmitBtn, setShowSubmitBtn] = useState(true)

    // console.log(showSubmitBtn)

    useEffect(() => {
        if (msg.content) {
            // console.log('msg to show useeffect working')
            dispatch(setToastContent(msg.content))
            dispatch(setToastContainerOptions({ type: msg.msgType }))
        }
        setShowSubmitBtn(true)
    }, [JSON.stringify(msg)])

    useEffect(() => {
        if (password.length > 8 && confirmPassword.length > 8) {
            setPrevSubmit({})
        } else {
            setShowPassword(false)
        }
    }, [password, confirmPassword])


    const handleForgetPasswordEmail = async (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        if (!showSubmitBtn) {
            return
        }
        setServerMsg('')
        const formData = new FormData(ev.target as HTMLFormElement | undefined);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const { errors } = checkValidation({
            password: password,
            confirmPassword: confirmPassword,
        });


        if (errors) {
            setMsgShowType('error')
            setValidationError('Invalid password or confirm password');
            return;
        }
        try {
            if (password.trim() !== confirmPassword.trim()) {
                setMsgShowType('error')
                setServerMsg('password and confirm password does not match')
                return;
            }
            const userNewPasswordProps = {
                password: password.trim(),
                confirmPassword: confirmPassword.trim(),
            };
            // console.log('--', isBothObjectSame(userNewPasswordProps, prevSubmit))
            if (!isBothObjectSame(userNewPasswordProps, prevSubmit)) {
                // console.log('--', isBothObjectSame(userNewPasswordProps, prevSubmit))
                setPrevSubmit(userNewPasswordProps)
                const response: any = await resetPassword({ userNewPasswordProps, id, token: token.split('&')[0] });
                // console.log(response)
                const { status, message } = response.data;
                // console.log(status, message)
                if (status === 'Failed') {
                    setMsgShowType('error')
                    setServerMsg(message);
                    return;
                } else {
                    setMsgShowType('success')
                    setServerMsg('password reset done, back to login');
                }

            } 
        } catch (error) {
            // console.log('status', error);
        }
    };


    return (
        <div className='flex min-h-screen flex-1 flex-col justify-center px-6 py-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                <h2 className='mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Reset Password</h2>
            </div>

            <div className='mt-5 sm:mx-auto sm:w-full sm:max-w-sm'>
                <form onSubmit={handleForgetPasswordEmail} className='space-y-12' method='POST'>
                    <div className='mt-2 relative select-none'>
                        <p>New Password</p>
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
                        {showPassword ? <FiEye
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
                    <div className='mt-2 relative'>
                        <p>Confirm New Password</p>
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
                        {showPassword ? <FiEye
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
                    <div className='font-bold h-[50px] flex flex-1 items-center justify-center'>
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                        <p>Password must includes lowercase, uppercase characters and digit</p>
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
                        {!isLoading &&
                            <button type='submit' className='absolute right-5 top-1.5 lex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                Set Password
                            </button>}
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
