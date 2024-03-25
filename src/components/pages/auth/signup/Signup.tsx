import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkValidation } from '../../../../services/validation-help';
import { useUserRegistrationMutation } from '../../../../services/api';
import TimerComponent from '../../../common/TimerComponent';
import { useDispatch } from 'react-redux';
import { reRenderToast, setToastContainerOptions, setToastContent } from '../../../../toastSlice';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [agreeTerms, setAgreeTerms] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [validationErrorMsg, setValidationErrorMsg] = useState<string | boolean>(false)
    const [serverMsg, setServerMsg] = useState<string | boolean>(false)
    const msgToShow = serverMsg ? serverMsg : validationErrorMsg
    const [msgShowType, setMsgShowType] = useState<'error' | 'success' | 'info'>('error')
    const [submitDisability, setSubmitDisability] = useState<boolean>(true)
    const [sentConfirmationEmail, setSentConfirmationEmail] = useState<any>(false)
    const [prevRegisterableData, setPrevRegisterableData] = useState({})

    const [register, { isLoading }] = useUserRegistrationMutation();


    useEffect(() => {
        dispatch(setToastContent(msgToShow))
        dispatch(setToastContainerOptions({ type: msgShowType }))
    }, [msgToShow])

    useEffect(() => {
        setPrevRegisterableData({})
        setSubmitDisability(((email.length > 1 && password.length > 8 && name.length > 1) && !isLoading) ? false : true)
    }, [name, email, password])

    const handleSignup = async (ev: React.SyntheticEvent) => {
        try {


            ev.preventDefault();
            setSubmitDisability(true)
            const formData = new FormData(ev.target as HTMLFormElement | undefined);
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;
            const agreeTerms: boolean = formData.get('agreeTerms') === 'on';
            const registerableData = {
                name,
                email,
                password,
                agreeTerms
            }
            const { errors: validationErrors } = checkValidation({
                fullName: name,
                email: email,
                password: password,
            });
            if (validationErrors) {
                setValidationErrorMsg('invalid ' + Object.keys(validationErrors).join(', '))
                return
            }
            try {
                if (Object.values(registerableData).join('') === Object.values(prevRegisterableData).join('')) {
                    return
                }
                setPrevRegisterableData(registerableData)
                const response: any = await register(registerableData)
                console.log(response)
                const { data, error } = response
                console.log(data)
                if (!error && data?.status === 'OK') {
                    setMsgShowType('success')
                    setServerMsg(data.message)
                    console.log('---', data.data.confLinkExpInMs)
                    setSentConfirmationEmail(Math.round((data.data.confLinkExpInMs) / 1000))
                } else {
                    setServerMsg(data?.message || 'could not signup, try again')
                }
            } catch (error) {
                console.log(error)
                setServerMsg('something went wrong, try again')
            } finally {
                setSubmitDisability(false)
            }
        } catch (error) {
            console.log(error)
            setServerMsg('something went wrong, try again')
        } finally {
            dispatch(reRenderToast())
            setSubmitDisability(false)
        }
    }

    return (
        <div className='flex min-h-screen flex-1 flex-col justify-center px-6 py-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                <h2 className='mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>Signup</h2>
            </div>

            <div className='mt-5 sm:mx-auto sm:w-full sm:max-w-sm'>
                <form onSubmit={(ev) => {
                    setSubmitDisability(true)
                    handleSignup(ev)
                }} className='space-y-12' method='POST'>
                    <div className='fields space-y-3'>
                        <div>
                            <label htmlFor='name' className='block text-sm font-medium leading-6 text-gray-900'>
                                Full name
                            </label>
                            <div className='mt-2'>
                                <input
                                    onChange={(ev) => {
                                        setName(ev.target.value);
                                    }}
                                    value={name}
                                    id='name'
                                    name='name'
                                    type='name'
                                    autoComplete='name'
                                    required
                                    className='focus:outline-[1px] focus:outline-gray-200 pl-1.5 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6'
                                />
                            </div>
                        </div>
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
                                <i
                                    onClick={() => {
                                        setShowPassword(!showPassword);
                                        setValidationErrorMsg(false)
                                    }}
                                    title={(showPassword ? 'hide' : 'show') + ' password'}
                                    className={'cursor-pointer absolute top-2 right-2 text-blue-500 fa-solid fa-eye' + (showPassword ? '-slash' : '')}
                                ></i>
                            </div>
                        </div>
                        <label htmlFor='agreeTerms' className='select-none flex items-center justify-left ml-3 text-sm font-medium leading-6 text-gray-900'>
                            Allow events, hightlight emails
                            <input
                                onChange={() => {
                                    setAgreeTerms(!agreeTerms);
                                }}
                                name='agreeTerms'
                                id='agreeTerms'
                                type='checkbox'
                                className='accent-green-600 ml-3'
                            />
                        </label>
                    </div>
                    <div className='font-bold h-[50px] flex flex-col flex-1 items-center justify-center'>
                        {sentConfirmationEmail &&
                            <TimerComponent
                                onEndTime={() => {
                                    setPrevRegisterableData({})
                                }} start={sentConfirmationEmail} prefix='Click on the confirmation link within ' />
                        }
                    </div>

                    <div className='relative'>
                        <button disabled={isLoading || submitDisability} type='submit' className={'fabsolute right-5 top-1.5 lex w-full justify-center rounded-m px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' + (!submitDisability ? 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-500' : 'bg-indigo-500 cursor-not-allowed')}>
                            Signup
                        </button>
                        {isLoading && (
                            <div className='absolute right-5 top-1.5 text-white inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]' role='status'>
                                <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>Loading...</span>
                            </div>
                        )}
                    </div>
                </form>
                <p className='mt-10 text-center text-sm text-gray-500 absolute bottom-5'>
                    Already have an account?
                    <a
                        href='/'
                        onClick={(ev) => {
                            ev.preventDefault();
                            navigate('/auth/login');
                        }}
                        className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
                    >
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
