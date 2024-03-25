interface UserInputTypes {
    _id: string;
    password: string;
    name: string;
    email: string;
    headline: string;
    agreeTerms: boolean;
    isEmailVerified: boolean;
    sentEmailLinkExpire: string;
    __v: number;
}

export type UserRegistrationTypes = Pick<UserInputTypes, 'name' | 'agreeTerms' | 'email' | 'password'>;

export type UserLoginTypes = Pick<UserInputTypes, 'email' | 'password'>;

export type UserUpdateMultipleDataTypes = Omit<UserInputTypes, '_id' | '__v' | 'sentEmailLinkExpire' | 'agreeTerms'> & {
    [P in keyof (Omit<UserInputTypes, '_id' | '__v' | 'sentEmailLinkExpire' | 'agreeTerms'>)]?: (Omit<UserInputTypes, '_id' | '__v' | 'sentEmailLinkExpire' | 'agreeTerms'>)[P];
};

export type UserChangePasswordTypes = Pick<UserInputTypes, 'password'> & {
    newPassword: string;
};

