import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SpinnerLoading from '../../../common/Spinner';
import { useUserSignupCompleteQuery } from '../../../../services/api';
import TimerComponent from '../../../common/TimerComponent';
import { useDispatch } from 'react-redux';
import { setToastContainerOptions, setToastContent } from '../../../../toastSlice';

const SignupComplete: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { id, token } = useParams();
    const [isLoadingNow, setIsLoadingNow] = useState(true)
    const { data, isLoading } = useUserSignupCompleteQuery({ id: id, token: token.split('&')[0] })

    useEffect(() => {
        if (data && data.status !== "Failed") {
            dispatch(setToastContainerOptions({ type: 'success' }))
            dispatch(setToastContent('Successfully verified email'))
        }
        setIsLoadingNow(isLoading)
    }, [isLoading])




    return (
        <div className='flex min-h-screen w-screen flex-1 flex-col justify-center px-6 py-6 lg:px-8'>
            {isLoadingNow ?
                <div className="flex items-center justify-center h-screen w-screen">
                    <TimerComponent
                        prefix={"loading..., automatically will return if not get response from server in "}
                        key={"key1"}
                        start={8}
                        onEndTime={() => {
                            navigate('/auth/login')
                        }}
                    />
                    <SpinnerLoading size='3rem' />
                </div>
                :
                <div className="flex items-center justify-center h-screen w-screen">
                    <TimerComponent
                        prefix={(data.status !== "Failed" ? "Successfully verified email" : (data?.message || "Failed to verify or something went wrong")) + ", redirecting to login page in "}
                        key={"key2"}
                        start={8}
                        onEndTime={() => {
                            navigate('/auth/login')
                        }}
                    />
                </div>
            }
        </div>
    );
};

export default SignupComplete;
