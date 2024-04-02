import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MdDashboard, MdSettings, MdLogout, MdMenu, MdKeyboardDoubleArrowUp, MdCancel, MdEmojiPeople } from "react-icons/md";
import { useEffect, useState, Fragment, useRef } from "react";
import SpinnerLoading from "../../common/Spinner";
import { useSwipeable } from 'react-swipeable';
import { useDispatch, useSelector } from "react-redux";

import DialogueConfirm from "../../common/Dialogue";
import { setUserToken } from "../../../rootSlice";

export default function Sidebar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const token = useSelector((state: any) => state.root.token)
    const asideRef = useRef()
    const smScreenSidebarPos = -60
    const [sidebarWidthPx, setSidebarWidthPx] = useState<number>(240)
    const [isLgSize, setIsLgSize] = useState(window.innerWidth >= 1024)
    const [showLogoutAlert, setShowLogoutAlert] = useState(false)

    const pathname = location.pathname
    const [top, setTop] = useState(window.innerWidth >= 1024 ? 0 : smScreenSidebarPos)

    // console.log('token --- ', token)
    if (!token) {
        navigate('/auth/login')
    }

    const [isOpenedSidebar, setIsOpenedSidebar] = useState(false)
    const openSidebar = () => {
        setTop(0)
        setIsOpenedSidebar(true)
    }
    const closeSidebar = () => {
        if (!isLgSize) {
            setTop(smScreenSidebarPos)
            setIsOpenedSidebar(false)
        }
    }
    const handleComponentAfterResize = () => {
        if (window.innerWidth >= 1024) {
            setIsLgSize(true)
            setTop(0)
        } else {
            setTop(smScreenSidebarPos)
            setIsLgSize(false)
            setIsOpenedSidebar(false)
        }
    };


    useEffect(() => {
        if (!token) {
            navigate('/auth/login')
            return
        }

        window.addEventListener('resize', handleComponentAfterResize);
        return () => window.removeEventListener('resize', handleComponentAfterResize);
    }, [token]);



    const swipeHandlers = useSwipeable({
        preventScrollOnSwipe: true,
        onSwipedUp: () => {
            closeSidebar()
        },
        onSwipedDown: () => {
            openSidebar()
        },
    });

    return (
        <>
            {showLogoutAlert &&
                <DialogueConfirm
                    key="logoutAccount"
                    onCancel={() => {
                        setTimeout(() => {
                            setShowLogoutAlert(false)
                        }, 100);
                    }}
                    onConfirm={() => {
                        localStorage.removeItem('token')
                        dispatch(setUserToken(null))

                    }} />}
            <div className="relative">
                <aside
                    ref={asideRef}
                    {...swipeHandlers}
                    style={{ top: top + "vh", width: isLgSize ? sidebarWidthPx : '100vw' }}
                    className={`z-[9999] flex ${top === 0 ? 'flex-col' : 'flex-col-reverse'} bg-gray-800 text-gray-400 w-full fixed left-0 h-[70vh] lg:h-[100vh] transition-[.4s]`}>
                    {token ?
                        (<Fragment>
                            <div className="h-full absolute top-0 "></div>
                            <div className="flex items-center justify-between h-[10vh] w-full">
                                <h3 className="text-center text-white text-[1.8rem] w-full ">MeInfoer</h3>
                                <div className="flex items-center justify-center gap-1 mr-2">
                                    <div className="text-white trigger" onClick={() => {
                                        if (isOpenedSidebar) {
                                            closeSidebar()
                                        } else {
                                            openSidebar()
                                        }

                                    }}>
                                        {!isLgSize &&
                                            (!isOpenedSidebar ?
                                                <MdMenu className="text-[1.9rem]" /> :
                                                <MdCancel className="text-[1.9rem]" />)
                                        }
                                    </div>
                                </div>
                            </div>
                            <nav className="my-8 w-full flex flex-col justify-center text-[white] gap-2">
                                <div
                                    onClick={() => {
                                        closeSidebar()
                                        navigate('/me')
                                    }}
                                    id="tab-me"
                                    className={"px-2 py-1 cursor-pointer rounded-[1px] lg:rounded-l-full flex gap-[2px] items-center hover:underline" + (pathname === '/me' ? ' bg-gray-100 bg-opacity-50' : '')}>
                                    <MdEmojiPeople className="text-[1.8rem] mr-5" />
                                    <button className="text-[1.4rem] rounded-full text-gray-100 block hover:text-gray-100 bg-opacity-50">Me</button>
                                </div>
                                <div
                                    onClick={() => {
                                        closeSidebar()
                                        navigate('/me/dashboard')
                                    }}
                                    id="tab-dashboard"
                                    className={"px-2 py-1 cursor-pointer rounded-[1px] lg:rounded-l-full flex gap-[2px] items-center hover:underline" + (pathname === '/me/dashboard' ? ' bg-gray-100 bg-opacity-50' : '')}>
                                    <MdDashboard className="text-[1.8rem] mr-5" />
                                    <button className="text-[1.4rem] rounded-full text-gray-100 block hover:text-gray-100 bg-opacity-50">Dashboard</button>
                                </div>
                                <div
                                    onClick={() => {
                                        closeSidebar()
                                        navigate('/me/settings')
                                    }}
                                    id="tab-setting"
                                    className={"px-2 py-1 cursor-pointer rounded-[1px] lg:rounded-l-full flex gap-[2px] items-center hover:underline" + (pathname === '/me/settings' ? ' bg-gray-100 bg-opacity-50' : '')}>
                                    <MdSettings className="text-[1.8rem] mr-5" />
                                    <button className="text-[1.4rem] rounded-full text-gray-100 block hover:text-gray-100 bg-opacity-50">Settings</button>
                                </div>
                                <div className="w-full flex items-center justify-center">
                                    <div
                                        onClick={() => {
                                            if (!showLogoutAlert) {
                                                closeSidebar()
                                                setShowLogoutAlert(true)
                                            }
                                        }}
                                        className={"mt-[40px] cursor-pointer rounded-[1px] lg:rounded-full flex items-center justify-center hover:underline px-3 py-1 border border-gray-100"}>
                                        <MdLogout className="text-[2.4rem] mr-2" />
                                        <button className="text-[1.4rem] rounded-full text-gray-100 block hover:text-gray-100 bg-opacity-50">Logout</button>
                                    </div>
                                </div>
                            </nav>
                            <div className={top === smScreenSidebarPos ? "hidden" : "lg:hidden absolute bottom-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center py-2"}>
                                <MdKeyboardDoubleArrowUp onClick={() => {
                                    closeSidebar()
                                }} className="text-[3.5rem]" />
                            </div>
                        </Fragment>)
                        :
                        <div className="flex items-center w-full justify-center">
                            <SpinnerLoading classnames="mt-16" size="3rem" />
                        </div>
                    }
                </aside >

                <div style={{
                    'left': isLgSize ? sidebarWidthPx : 0,
                    'width': isLgSize ? `calc(100% - ${sidebarWidthPx}px)` : '100vw'
                }} className={`flex items-center justify-center absolute top-[${isLgSize ? "0" : "10"}vh] min-h-[100vh] h-auto`}>
                    {!token ?
                        <SpinnerLoading size="3rem" />
                        :
                        <Outlet />
                    }
                </div>

            </div ></>
    )

}