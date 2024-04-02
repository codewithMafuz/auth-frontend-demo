interface UserInputTypes {
    _id: string;
    password: string;
    name: string;
    email: string;
    headline: string;
    agreeTerms: boolean;
    isEmailVerified: boolean;
    profilePath: string | null;
    sentEmailLinkExpire: string;
    __v: number;
}

export type UserRegistrationTypes = Pick<UserInputTypes, 'name' | 'agreeTerms' | 'email' | 'password'>;

export type UserLoginTypes = Pick<UserInputTypes, 'email' | 'password'>;

export type UserChangePasswordTypes = Pick<UserInputTypes, 'password'> & {
    newPassword: string;
};

