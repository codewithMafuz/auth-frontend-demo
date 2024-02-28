interface User {
    _id: string;
    password: string;
    name: string;
    email: string;
    phone: string;
    recieveEmails: boolean;
    __v: number;
}

export type UserRegistration = Omit<User, 'phone' | '_id' | '__v'>;

export type UserLogin = Pick<User, 'email' | 'password'> & {
    rememberMe?: boolean;
};
