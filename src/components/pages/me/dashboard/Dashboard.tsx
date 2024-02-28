import React, { useEffect } from 'react';
import { useUserLoggedInQuery } from '../../../../services/api';
import { getToken } from '../../../../services/tokenServices';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const token = getToken();
    const { data, isSuccess, isError, isLoading } = useUserLoggedInQuery(token);

    if (isSuccess || isError) {
        console.log(isSuccess || isError);
    }

    useEffect(() => {
        console.log('isloading');
    }, [isLoading]);

    return <>{JSON.stringify(data)}</>;
};

export default Dashboard;
