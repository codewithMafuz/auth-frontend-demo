import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SpinnerLoading from '../../../common/Spinner';
import { useUserDeleteAccountMutation, useUserLoggedInQuery, useUserUpdateDataMutation, useUserUpdatePasswordMutation } from '../../../../services/api';
import { checkValidation, isValidPasswordNormal } from '../../../../services/validation-help';
import { setToastContainerOptions, setToastContent } from '../../../../toastSlice';
import { setUserInfo } from '../../userSlice';
import FirebaseFileUploader from '../../../common/FirebaseImageUploader';
import { deleteObject, ref } from 'firebase/storage';
import { imageDb } from '../../../../configs/firebaseConfig';
import DialogueConfirm from '../../../common/Dialogue';
import { useNavigate } from 'react-router-dom';
import { setUserToken } from '../../../../rootSlice';

const Settings = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const token = useSelector((state: any) => state.root.token)
    const stateData = useSelector((state: any) => state.user)
    const { data } = useUserLoggedInQuery(token)
    const user = data?.data?.user

    useEffect(() => {
        if (user && !stateData._id) {
            dispatch(setUserInfo({ _id, name, profilePath, headline, socialLinks }))
        }
    }, [user])

    const {
        _id,
        name,
        profilePath = null,
        headline = '',
        socialLinks = { linkedin: '#', github: '#' }
    } = user || {}

    // console.log("setting distructured consts from STATE :", { _id: stateData._id, name: stateData.name, headline: stateData.headline, profilePath: stateData.profilePath })
    // console.log("setting distructured consts from fetched :", { _id, name, headline, profilePath })

    const [updateDataMutation, { isLoading: isUpdateDatasLoading }] = useUserUpdateDataMutation();
    const [updatePassword, { isLoading: isUpdatePasswordLoading }] = useUserUpdatePasswordMutation();
    const [deleteAccount, { isLoading: isDeleteAccountLoading }] = useUserDeleteAccountMutation();


    const [isLoadingNow, setIsLoadingNow] = useState({ fullPage: true, generalData: true, passwordData: true })
    const [msg, setMsg] = useState<any>({ content: '', msgType: 'error', msgRenderedTime: 0 })

    const [currentName, setCurrentName] = useState('');
    const [currentHeadline, setCurrentHeadline] = useState('');

    const getValidDatas = (datas: object) => {
        return Object.fromEntries(
            (Object.entries(datas)).filter(([_, val]) => val !== '')
        )
    }
    const profileData = getValidDatas({ _id: _id || stateData._id, name: currentName, headline: currentHeadline })

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('')

    const [showDeleteModal, setShowDeleteModal] = useState(false)

    useEffect(() => {
        if (msg.content) {
            dispatch(setToastContent(msg.content))
            dispatch(setToastContainerOptions({ type: msg.msgType }))
        }
    }, [JSON.stringify(msg)])

    useEffect(() => {
        setIsLoadingNow({
            fullPage: (!stateData._id && _id) || isDeleteAccountLoading,
            generalData: isUpdateDatasLoading,
            passwordData: isUpdatePasswordLoading,
        })
    }, [_id, stateData._id, isUpdateDatasLoading, isUpdatePasswordLoading, isDeleteAccountLoading])


    const handleNameChange = (ev) => {
        setCurrentName(ev.target.value);
    };

    const handleHeadlineChange = (ev) => {
        setCurrentHeadline(ev.target.value);
    };

    const handleNewPasswordChange = (ev) => {
        setNewPassword(ev.target.value.trim());
    };

    const handleOldPasswordChange = (ev) => {
        setPassword(ev.target.value.trim());
    };

    const handleProfileDataChangeSubmit = async (ev) => {
        try {
            ev.preventDefault();
            setIsLoadingNow(prev => ({ ...prev, generatData: true }))
            const isErrors = checkValidation(profileData).errors
            if (isErrors) {
                setMsg((prev: any) => ({
                    ...prev, msgRenderedTime: Date.now(), content: `Invalid ${Object.keys(isErrors).join(',')}`, msgType: "error"
                }));
                return
            }
            updateDataMutation(profileData)
                .then((response: any) => {
                    if (response?.data?.status !== 'Failed') {
                        dispatch(setUserInfo(response['data']['data']))
                    } else {
                        setMsg((prev: any) => ({
                            ...prev, msgRenderedTime: Date.now(), content: "Failed to update", msgType: "error"
                        }));
                    }
                })
                .catch(er => {
                    setMsg((prev: any) => ({
                        ...prev, msgRenderedTime: Date.now(), content: "Failed to update", msgType: "error"
                    }));
                })
            setMsg((prev: any) => ({
                ...prev, msgRenderedTime: Date.now(), content: "updated data successfully", msgType: "success"
            }));

        } catch (error) {
            setMsg((prev: any) => ({
                ...prev, msgRenderedTime: Date.now(), content: 'Something went wrong, please try again', msgType: "error"
            }));
        } finally {
            setIsLoadingNow(prev => ({ ...prev, generatData: false }))

        }
    };

    const handlePasswordUpdateSubmit = async (ev) => {
        try {
            ev.preventDefault();
            setIsLoadingNow(prev => ({ ...prev, passwordData: true }))
            const oldPassword = isValidPasswordNormal(password, true)
            const new_Password = isValidPasswordNormal(newPassword, true)
            if (!stateData._id || !oldPassword || !new_Password) {
                setMsg((prev: any) => ({
                    ...prev, msgRenderedTime: Date.now(), content: 'Invalid new or old password', msgType: "error"
                }));
            }
            const finalDatas = {
                _id: stateData._id,
                password: password,
                newPassword: new_Password,
            }
            const response: any = await updatePassword(finalDatas)
            if (response?.data?.status !== 'Failed') {
                delete finalDatas._id
                delete finalDatas.newPassword
                setPassword('')
                setNewPassword('')
                setMsg((prev: any) => ({
                    ...prev, msgRenderedTime: Date.now(), content: `Successfully updated ${Object.keys(finalDatas).join(', ')}`, msgType: "success"
                }));
            } else {
                setMsg((prev: any) => ({
                    ...prev, msgRenderedTime: Date.now(), content: "Failed to update password", msgType: "success"
                }));
            }
        } catch (error) {
            setMsg((prev: any) => ({
                ...prev, msgRenderedTime: Date.now(), content: "Failed to update password", msgType: "success"
            }));
        } finally {
            setIsLoadingNow(prev => ({ ...prev, passwordData: false }))
        }
    };

    const handleOnUploadedFile = async (onUploadedData) => {
        try {
            if (profilePath || stateData.profilePath) {
                const storageRef = ref(imageDb, profilePath || stateData.profilePath)
                await deleteObject(storageRef)
            }
            await updateDataMutation({ _id: _id, profilePath: onUploadedData.profilePath })

            dispatch(setUserInfo({ profilePath: onUploadedData.profilePath, profileSrc: onUploadedData.profileSrc }))

        } catch (error) {
            // console.log(error)
        }
    }

    const handleDeleteAccount = async (inputValue) => {
        try {
            setShowDeleteModal(false)
            const password = inputValue.trim()
            if (!isValidPasswordNormal(password)) {
                setMsg((prev: any) => ({
                    ...prev, msgRenderedTime: Date.now(), content: "Password is incorrect", msgType: "error"
                }));
                return
            }
            const response: any = await deleteAccount({ password })
            const message = response.data.message
            if (response.data.status !== "Failed") {
                const afterRun = () => {
                    localStorage.removeItem("token")
                    dispatch(setUserToken(null))
                    navigate('/auth/signup')
                    setMsg((prev: any) => ({
                        ...prev, msgRenderedTime: Date.now(), content: "Your Account has been deleted permanently", msgType: "info"
                    }));
                }
                if (profilePath || stateData.profilePath) {
                    try {
                        const storageRef = ref(imageDb, stateData.profilePath || profilePath)
                        await deleteObject(storageRef)
                        afterRun()
                    } catch (_) {
                        afterRun()
                    }
                } else {
                    afterRun()
                }
            } else {
                setMsg((prev: any) => ({
                    ...prev, msgRenderedTime: Date.now(), content: message, msgType: "error"
                }));
            }
        } catch (error) {
            setMsg((prev: any) => ({
                ...prev, msgRenderedTime: Date.now(), content: "Failed to delete account, something went wrong", msgType: "error"
            }));
        }
    }


    return (
        <div className="w-auto max-w-[100vw] px-[4px] lg:px-12 py-[4px] lg:py-4">
            {isLoadingNow.fullPage ?
                <div className="flex items-center justify-center h-[100vh] w-full">
                    <SpinnerLoading size='3rem' />
                </div>
                :
                <div>
                    <h2 className='text-[40px] mb-8'>Setting</h2>

                    <form onSubmit={handleProfileDataChangeSubmit}>
                        <h3 className='text-[30px] mb-10 mt-2'>Profile and General Info</h3>
                        <label className="block mb-4 max-w-[90vw] lg:max-w-[50vw]">
                            Name : <b className='break-all'>{stateData.name || name}</b>
                            <input
                                type="text"
                                value={currentName}
                                onChange={handleNameChange}
                                className="block w-full border-gray-500 border rounded-md p-2"
                            />
                        </label>
                        <label className="block mb-4 max-w-[90vw] lg:max-w-[50vw]">
                            Your Profile Headline :
                            <br />
                            <b className='break-all'>{stateData.headline || headline}</b>
                            <input
                                type="text"
                                value={currentHeadline}
                                onChange={handleHeadlineChange}
                                className="block w-full border-gray-500 border rounded-md p-2"
                            />
                        </label>
                        <div className="flex justify-center lg:justify-start lg:ml-4">
                            <button
                                disabled={isLoadingNow.generalData}
                                type="submit"
                                className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                            >
                                Save Update
                            </button>
                        </div>
                    </form>
                    <form onSubmit={handlePasswordUpdateSubmit}>
                        <h3 className='text-[30px] mb-10 mt-2'>Update Password</h3>
                        <label className="block mb-4 max-w-[90vw] lg:max-w-[50vw]">
                            Old Password : ******
                            <input
                                type="password"
                                value={password}
                                onChange={handleOldPasswordChange}
                                className="block w-full border-gray-500 border rounded-md p-2"
                            />
                        </label>
                        <label className="block mb-4 max-w-[90vw] lg:max-w-[50vw]">
                            New Password (Must be uppercase, lowercase, at least one digit included)
                            <input
                                type="text"
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                className="block w-full border-gray-500 border rounded-md p-2"
                            />
                        </label>
                        <div className="flex justify-center lg:justify-start lg:ml-4">
                            <button
                                disabled={isLoadingNow.passwordData}

                                type="submit"
                                className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                            >
                                Save Update
                            </button>
                        </div>
                    </form>
                    <FirebaseFileUploader
                        onUploaded={handleOnUploadedFile}
                        onFetchInitialImgSrc={(imgSrc) => {
                            dispatch(setUserInfo({ profileSrc: imgSrc }))
                        }}
                        initialFileSrc={stateData.profileSrc}
                        initialFilePath={profilePath || stateData.profilePath}
                        title='Uplaod Profile Image'
                        subtitle="Upload Profile Image"
                        btnTitle="Upload Image"
                    />
                    <div className="flex items-center justify-center mt-20 p-1 flex-col">
                        <h3 className='text-center my-2 text-[30px] mb-10 mt-2 p-1'>Delete account</h3>
                        <div className="flex items-center justify-center">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(true)
                                }}
                                className=" bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                            >
                                Delete Account
                            </button>
                        </div>

                        {showDeleteModal &&
                            <DialogueConfirm
                                inputField={{
                                    show: true,
                                    type: "password",
                                }}
                                key="deleteAccount"
                                title='Delete Account'
                                subtitle='By Confirming, your account will be permanently deleted and this action cannot be undone'
                                confirmBtnTxt='Confirm Delete'
                                cancelBtnTxt='Cancel'
                                onCancel={() => {
                                    setShowDeleteModal(false)
                                }}
                                onConfirm={handleDeleteAccount}

                            />}
                    </div>
                </div>
            }

        </div >
    );
};

export default Settings;

