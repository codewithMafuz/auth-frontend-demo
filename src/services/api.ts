import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserRegistration, UserLogin } from '../models/user.model';

export const userApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_API }),
    endpoints: (builder) => ({
        userRegistration: builder.mutation<any, UserRegistration>({
            query: (userRegistrationProps) => ({
                url: '/registration',
                method: 'POST',
                body: userRegistrationProps,
            }),
        }),
        userLogin: builder.mutation<any, UserLogin>({
            query: (userLoginProps) => ({
                url: '/login',
                method: 'POST',
                body: userLoginProps,
            }),
        }),
        userForgotPassword: builder.mutation<any, any>({
            query: (userForgotPasswordProps) => ({
                url: '/send-reset-password-email',
                method: 'POST',
                body: userForgotPasswordProps,
            }),
        }),
        userResetPassword: builder.mutation({
            query: ({ userNewPasswordProps, id, token }) => ({
                url: `/reset-password/${id}/${token}`,
                method: 'POST',
                body: userNewPasswordProps,
            }),
        }),
        userLoggedIn: builder.query({
            query: (token) => ({
                url: `/loggedin`,
                method: 'GET',
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }),
        }),
    }),
});

export const { useUserRegistrationMutation, useUserLoginMutation, useUserForgotPasswordMutation, useUserResetPasswordMutation, useUserLoggedInQuery } = userApi;
