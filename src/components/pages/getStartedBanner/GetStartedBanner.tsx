import { useNavigate } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import './GetStarted.css'
import CheckLoggedIn from '../../../services/CheckLoggedIn';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../userSlice';

const GetStartedBanner: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleClickOnGetStarted = (ev) => {
        navigate('/auth/signup')
    }

    return (
        <>
            <CheckLoggedIn actionOnIfLoggedIn={(user) => {
                const { name, email, _id, profilePath } = user
                dispatch(setUserInfo({ name, email, _id, profilePath }))
                navigate('/me')
            }} />
            <div className="area">
                <ul className="circles">
                    <li className='text-center flex items-center justify-center text-white'>Showcase</li>
                    <li className='text-center flex items-center justify-center text-white'>Skills</li>
                    <li className='text-center flex items-center justify-center text-white'>Portfolio</li>
                    <li className='text-center flex items-center justify-center text-white'>More</li>
                    <li className='text-center flex items-center justify-center text-white'>Explore</li>
                    <li className='text-center flex items-center justify-center text-white'>Showcase</li>
                    <li className='text-center flex items-center justify-center text-white'>Skills</li>
                    <li className='text-center flex items-center justify-center text-white'>Portfolio</li>
                    <li className='text-center flex items-center justify-center text-white'>More</li>
                    <li className='text-center flex items-center justify-center text-white'>Explore</li>
                </ul>
            </div>



            <div className='min-h-[90vh] flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-transparent p-8 text-center  flex items-center'>
                <div className="bg-blue-500/50 rounded-[30px] p-4 transition-[1s]">


                    <div className="w-max flex flex-col items-center justify-center text-4xl font-bold mb-4 ">
                        <h1>Get Started </h1>
                        <h1 className='animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-white pr-5 text-white'>with MeInfoer</h1>
                    </div>
                    <div className='text-lg text-white'>
                        <Typewriter
                            options={{
                                strings: 'Showcase Your Skills and Portfolio@with MeInfoer@and Improve yourself'.split('@'),
                                autoStart: true,
                                loop: true,
                            }}
                        />
                    </div>
                    <button
                        onClick={handleClickOnGetStarted}
                        className='text-lg text-light-100 bg-blue-600 contained mt-4 transition-all text-gray-200 px-4 py-2 rounded-full hover:bg-blue-800 hover:text-gray-100'
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </>
    );
};

export default GetStartedBanner;

