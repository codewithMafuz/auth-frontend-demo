import { useEffect } from "react"
import { Fragment } from "react/jsx-runtime"
import { getToken } from "./tokenServices"
import { useSelector } from "react-redux"
import { useUserLoggedInQuery } from "./api"


const CheckLoggedIn = ({
    actionOnIfLoggedIn = () => { },
}: {
    actionOnIfLoggedIn?: (user) => void
}) => {

    const token = useSelector((state: any) => state.root.token)

    const { data } = useUserLoggedInQuery(token || getToken())
    const user = data?.data?.user

    useEffect(() => {
        if (user) {
            actionOnIfLoggedIn(user)
        }
    }, [user])

    return (
        <Fragment>{''}</Fragment>
    )
}

export default CheckLoggedIn