import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Tooltip,
} from "@material-tailwind/react";


import EmptyImage from '../../../images/images-empty.png'
import { useDispatch, useSelector } from "react-redux";
import { useUserLoggedInQuery, useUserUpdateDataMutation } from "../../../services/api";
import { setUserInfo } from "../userSlice";
import { useEffect, useState } from "react";
import { getImageDownloadURL } from "../../../configs/firebaseConfig";
import { isBothObjectSame } from "../../../services/commonFunctions";


export default function Me() {
    const dispatch = useDispatch()

    const [updateDataMutation, { }] = useUserUpdateDataMutation();
    const token = useSelector((state: any) => state.root.token)
    const stateData = useSelector((state: any) => state.user)
    const [currentProfileSrc, setCurrentProfileSrc] = useState(null)
    const { data, isLoading } = useUserLoggedInQuery(token)
    const [updatedLastThing, setUpdatedLastThing] = useState({})
    const user = data?.data?.user

    let {
        _id,
        name,
        profilePath = null,
        headline = '',
        socialLinks = { linkedin: '#', github: '#' }
    } = data?.data?.user || {}

    // console.log(stateData)
    // console.log(user)

    useEffect(() => {
        if (user && !stateData._id) {
            dispatch(setUserInfo({ _id, name, profilePath, headline, socialLinks }))
        }
    }, [user])

    if (!stateData.profileSrc && profilePath && !currentProfileSrc) {
        getImageDownloadURL(profilePath)
            .then(async (imgSrc) => {
                // console.log(imgSrc)
                if (imgSrc) {
                    setCurrentProfileSrc(imgSrc)
                    dispatch(setUserInfo({ profileSrc: imgSrc }))
                } else {
                    setCurrentProfileSrc(EmptyImage)
                    dispatch(setUserInfo({ profilePath: null, profileSrc: null }))
                    const haveToUpdateData = { _id, profilePath: null }
                    if (!isBothObjectSame(updatedLastThing, haveToUpdateData)) {
                        setUpdatedLastThing(haveToUpdateData)
                        await updateDataMutation(haveToUpdateData)
                    }
                }
                return
            })
            .catch((er) => {
                // console.log("error in last er :", er)
            })
    }


    return (
        isLoading ?
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse rounded-full h-36 w-36 bg-gray-200"></div>
            </div> :
            <div>
                <Typography placeholder=""
                    className="text-center text-[3rem] font-bold" >
                    Me
                </Typography >

                <div className="flex justify-center">
                    <Card placeholder="" className="w-96">
                        <CardHeader placeholder="" floated={false}>
                            <img
                                className="h-auto w-auto object-cover rounded-[14px]"
                                src={stateData.profileSrc || currentProfileSrc || EmptyImage}
                                alt="profile" />
                        </CardHeader>
                        <CardBody placeholder="" className="text-center">
                            <Typography placeholder="" variant="h4" color="blue-gray" className="mb-2">
                                {stateData.name || name}
                            </Typography>
                            <Typography placeholder="" color="blue-gray" className="font-medium" textGradient>
                                {stateData.headline || headline}
                            </Typography>
                        </CardBody>
                        <CardFooter placeholder="" className="flex justify-center gap-7 pt-2">
                            <Tooltip content="See profile">
                                <Typography placeholder=""
                                    href={stateData?.socialLinks?.linkedin || socialLinks.linkedin}
                                    variant="lead"
                                    color="blue"
                                    textGradient
                                >
                                    <i className="text-[1.3rem] fab fa-linkedin" />
                                </Typography>
                            </Tooltip>
                            <Tooltip content="Check">
                                <Typography placeholder=""
                                    href={stateData?.socialLinks?.github || socialLinks.github}
                                    variant="lead"
                                    color="blue"
                                    textGradient
                                >
                                    <i className="text-[1.3rem] fab fa-github" />
                                </Typography>
                            </Tooltip>
                        </CardFooter>
                    </Card>
                </div>
            </div>
    );
}
