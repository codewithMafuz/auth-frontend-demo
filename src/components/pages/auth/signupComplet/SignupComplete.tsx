import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SpinnerLoading from '../../../common/Spinner';
import { useUserSignupCompleteQuery } from '../../../../services/api';
import TimerComponent from '../../../common/TimerComponent';
import { useDispatch } from 'react-redux';
import { reRenderToast, setToastContainerOptions, setToastContent } from '../../../../toastSlice';

const SignupComplete: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { id, token } = useParams();

    const { data, isLoading } = useUserSignupCompleteQuery({ id: id, token: token })

    console.log(data)
    if (data.success || data?.data?.success) {
        setToastContainerOptions({ type: 'success' })
        setToastContent('Successfully verified email')
    }


    return (
        <div className='flex min-h-screen flex-1 flex-col justify-center px-6 py-6 lg:px-8'>
            {isLoading ?
                <SpinnerLoading size='3rem' />
                :
                !isLoading && data.status === 'Failed' ?
                    <div className='flex flex-col items-center justify-center h-40'>
                        <p className='text-center'>{data.message}</p>
                        <Link className='underline text-blue-500' to='/auth/login' >Login</Link>
                    </div>
                    :
                    (<><p>Going to Login Page in {<TimerComponent
                        onEndTime={() => {
                            navigate('/auth/login')
                        }}
                    />}
                    </p>

                        <div className='mt-5 sm:mx-auto sm:w-full sm:max-w-sm'>
                            <div className='relative'>
                                <button onClick={() => {
                                    navigate('/auth/login');
                                }} type='button' className='absolute right-5 top-1.5 lex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                    {isLoading ? '...' : 'Back to Login'}
                                </button>
                                {isLoading && (
                                    <div className='absolute right-5 top-1.5 text-white inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]' role='status'>
                                        <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>Loading...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>)
            }

        </div>
    );
};

export default SignupComplete;
