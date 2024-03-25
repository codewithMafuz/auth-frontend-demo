import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SpinnerLoading from '../../../common/Spinner';
import { useUserUpdateDataMutation, useUserUpdatePasswordMutation } from '../../../../services/api';
import { checkValidation, isValidPasswordNormal } from '../../../../services/validation-help';
import { setToastContainerOptions, setToastContent } from '../../../../toastSlice';
import { setUserInfo } from '../../userSlice';

const Settings = () => {
    const dispatch = useDispatch()

    const [updateDataMutation, { isLoading: isUpdateDatasLoading }] = useUserUpdateDataMutation();
    const [updatePassword, { isLoading: isUpdatePasswordLoading }] = useUserUpdatePasswordMutation();

    const { _id, name, headline } = useSelector((state: any) => state.user)
    const [isLoadingNow, setIsLoadingNow] = useState(true)
    const [msg, setMsg] = useState('')
    const [msgType, setMsgType] = useState('red')
    const [prevSubmitName, setPrevSubmitName] = useState('')
    const [prevSubmitHeadline, setPrevSubmitHeadline] = useState('')
    const [prevSubmitPswds, setPrevSubmitPswds] = useState('')

    const [newName, setNewName] = useState(name || '');
    const [newHeadline, setNewHeadline] = useState(headline || '');

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const getValidDatas = (datas: object) => {
        return Object.fromEntries(
            (Object.entries(datas)).filter(([_, val]) => val !== '')
        )
    }

    useEffect(() => {
        if (msg) {
            dispatch(setToastContent(msg))
            dispatch(setToastContainerOptions({ type: msgType }))
        }
    }, [msg])


    useEffect(() => {
        if (!_id || isUpdateDatasLoading || isUpdatePasswordLoading) {
            setIsLoadingNow(true)
        } else {
            setIsLoadingNow(false)
        }
    }, [_id, isUpdateDatasLoading, isUpdatePasswordLoading])

    const handleNameChange = (ev) => {
        setPrevSubmitName('')
        setNewName(ev.target.value);
    };

    const handleHeadlineChange = (ev) => {
        setPrevSubmitHeadline('')
        setNewHeadline(ev.target.value);
    };

    const handleNewPasswordChange = (ev) => {
        setPrevSubmitPswds('')
        setNewPassword(ev.target.value.trim());
    };

    const handleOldPasswordChange = (ev) => {
        setPrevSubmitPswds('')
        setPassword(ev.target.value.trim());
    };

    const handleProfileDataChangeSubmit = async (ev) => {
        try {
            ev.preventDefault();
            const updatableData = getValidDatas({ _id: _id, name: newName, headline: newHeadline })
            if (updatableData.headline && prevSubmitHeadline === newHeadline) {
                return
            }
            if (updatableData.name && prevSubmitName === newName) {
                return
            }
            setPrevSubmitHeadline(updatableData.headline)
            setPrevSubmitName(updatableData.name)
            setIsLoadingNow(true)
            const isErrors = checkValidation(updatableData).errors
            if (isErrors) {
                setMsgType('error')
                setMsg(`Invalid ${Object.keys(isErrors).join(',')}`)
                setIsLoadingNow(false)
                return
            }
            dispatch(setUserInfo({ ...updatableData }))
            await updateDataMutation(updatableData)
            setMsgType('success')
            setMsg("updated data successfully")

        } catch (error) {
            setMsgType('error')
            setMsg('Something went wrong, please try again')
            setIsLoadingNow(false)
            return
        } finally {
            setIsLoadingNow(false)
        }
    };

    const handlePasswordUpdateSubmit = async (ev) => {
        try {
            ev.preventDefault();
            setIsLoadingNow(true)
            const oldPassword = isValidPasswordNormal(password, true)
            const new_Password = isValidPasswordNormal(newPassword, true)
            if (_id || !oldPassword || !new_Password) {
                setIsLoadingNow(false)
                return setMsg("Invalid new or old password")
            }
            const currentSubmitPswds = _id.toString() + oldPassword + new_Password
            if (prevSubmitPswds === currentSubmitPswds) {
                return
            }
            setPrevSubmitPswds(currentSubmitPswds)
            const finalDatas = {
                _id: _id,
                password: password,
                newPassword: new_Password,
            }
            const response = await updatePassword(finalDatas)
            if (response) {
                setPassword('')
                setNewPassword('')
            }
            setMsgType('success')
            return setMsg(`Successfully updated ${Object.keys(finalDatas).join(', ')}`)

        } catch (error) {
            return setMsg('Something went wrong, please try again')
        }
    };


    return (
        <div className="w-auto px-[4px] lg:px-12 py-[4px] lg:py-4">
            {isLoadingNow ?
                <div className="flex items-center justify-center h-[100vh] w-full">
                    <SpinnerLoading size='3rem' />
                </div>
                :
                <div>
                    <h2 className='text-[40px] mb-8'>Setting</h2>

                    <form onSubmit={handleProfileDataChangeSubmit}>
                        <h3 className='text-[30px] mb-10 mt-2'>Profile and General Info</h3>
                        <label className="block mb-4">
                            Name : <b>{name}</b>
                            <input
                                type="text"
                                value={newName}
                                onChange={handleNameChange}
                                className="block w-full border-gray-500 border rounded-md p-2"
                            />
                        </label>
                        <label className="block mb-4">
                            Your Profile Headline : <b>{headline || 'N/A'}</b>
                            <input
                                type="text"
                                value={newHeadline}
                                onChange={handleHeadlineChange}
                                className="block w-full border-gray-500 border rounded-md p-2"
                            />
                        </label>
                        <div className="flex justify-center lg:justify-start lg:ml-4">
                            <button
                                type="submit"
                                className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                            >
                                Save Update
                            </button>
                        </div>
                    </form>
                    <form onSubmit={handlePasswordUpdateSubmit}>
                        <h3 className='text-[30px] mb-10 mt-2'>Update Password</h3>
                        <label className="block mb-4">
                            Old Password
                            <input
                                type="password"
                                value={password}
                                onChange={handleOldPasswordChange}
                                className="block w-full border-gray-500 border rounded-md p-2"
                            />
                        </label>
                        <label className="block mb-4">
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
                                type="submit"
                                className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                            >
                                Save Update
                            </button>
                        </div>
                    </form>
                </div>
            }

        </div >
    );
};

export default Settings;


