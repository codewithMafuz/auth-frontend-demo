import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserRegistrationTypes, UserLoginTypes, UserChangePasswordTypes } from '../models/user.model';
import { getToken } from './tokenServices';

export const userApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BASE_API,
        prepareHeaders: (headers, { getState }) => {
            const token = getState()['root']['token'] || getToken()
            if (token) {
                headers.set('Authorization', 'Bearer ' + token)
            }
        },
    }),

    endpoints: (builder) => ({
        userRegistration: builder.mutation<any, UserRegistrationTypes>({
            query: (userRegistrationProps) => ({
                url: '/registration',
                method: 'POST',
                body: userRegistrationProps,
            }),
        }),
        userSignupComplete: builder.query({
            query: ({ id, token }) => ({
                url: `/complete-signup/${id}/${token}`,
                method: 'GET',
            })
        }),
        userLogin: builder.mutation<any, UserLoginTypes>({
            query: (userLoginProps) => ({
                url: '/login',
                method: 'POST',
                body: userLoginProps,
            }),
        }),
        userForgotPassword: builder.mutation({
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
            query: (token = getToken()) => ({
                url: `/loggedin`,
                method: 'GET',
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }),
        }),
        userUpdateData: builder.mutation({
            query: (userNewDatas) => ({
                url: '/update-data',
                method: 'POST',
                body: userNewDatas,
            }),
        }),
        userUpdatePassword: builder.mutation<any, UserChangePasswordTypes>({
            query: (data) => ({
                url: '/update-password',
                method: 'POST',
                body: data,
            }),
        }),
        userDeleteAccount: builder.mutation<any, { password: string }>({
            query: (data) => ({
                url: '/delete-user',
                method: 'POST',
                body: data
            })
        })
    }),
});

export const { useUserRegistrationMutation, useUserLoginMutation, useUserForgotPasswordMutation, useUserResetPasswordMutation, useUserLoggedInQuery, useLazyUserLoggedInQuery, useUserSignupCompleteQuery, useUserUpdateDataMutation, useUserUpdatePasswordMutation, useUserDeleteAccountMutation } = userApi;


