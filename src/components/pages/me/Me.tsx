import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Tooltip,
} from "@material-tailwind/react";

import EmptyImage from '../../../images/images-empty.png'
import { useSelector } from "react-redux";


export default function Me() {

    const { _id, name, profileUrl, headline = 'Your Headline Here...', socialLinks = { linkedin: '#', github: '#' } } = useSelector((state: any) => state.user)

    console.log(_id)
    return (

        // isReady &&
        <div>
            < h1 className="text-center text-[3rem] font-bold" > Me</h1 >

            <div className="flex justify-center">
                <Card placeholder={''} className="w-96">
                    <CardHeader placeholder={''} floated={false} className="h-80">
                        <img
                            src={profileUrl || EmptyImage}
                            alt="profile" />
                    </CardHeader>
                    <CardBody placeholder={''} className="text-center">
                        <Typography placeholder={''} variant="h4" color="blue-gray" className="mb-2">
                            {name}
                        </Typography>
                        <Typography placeholder={''} color="blue-gray" className="font-medium" textGradient>
                            {headline}
                        </Typography>
                    </CardBody>
                    <CardFooter placeholder={''} className="flex justify-center gap-7 pt-2">
                        <Tooltip content="See profile">
                            <Typography
                                placeholder={''}
                                href={socialLinks.linkedin}
                                variant="lead"
                                color="blue"
                                textGradient
                            >
                                <i className="text-[1.3rem] fab fa-linkedin" />
                            </Typography>
                        </Tooltip>
                        <Tooltip content="Check">
                            <Typography
                                placeholder={''}
                                href={socialLinks.github}
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
        </div >

    );
}
