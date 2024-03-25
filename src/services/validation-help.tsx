const isValidSingleName = (name: string, returning: boolean = false): any => {
    const pass = name.length >= 2;
    if (returning) {
        return name
    }
    return pass
}

const isValidFullName = (fullname: string, returning: boolean = false): any => {
    const pass = [2, 3, 4, 5].includes(fullname.split(' ').length);
    if (returning) {
        return fullname
    }
    return pass
}

const isValidEmailAddress = (email: string, returning: boolean = false): any => {
    const pass = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (returning) {
        return email
    }
    return pass
}

const isValidPasswordNormal = (password: string, returning: boolean = false): any => {
    const pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d.$]{8,32}/.test(password);
    if (returning) {
        return password
    }
    return pass
}

type ValidationTypes = 'singleName' | 'fullName' | 'name' | 'email' | 'password' | 'confirmPassword';

const validationTypesFunc: Record<ValidationTypes, (value: string) => boolean> = {
    singleName: isValidSingleName,
    fullName: isValidFullName,
    name: isValidFullName,
    email: isValidEmailAddress,
    password: isValidPasswordNormal,
    confirmPassword: isValidPasswordNormal,
};

interface CheckValidationParams {
    singleName?: string;
    fullName?: string;
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    [key: string]: string | undefined;
}

interface CheckValidationResult {
    errors: Record<ValidationTypes, boolean> | false;
}

const checkValidation = (typesAndValues: CheckValidationParams = {}): CheckValidationResult => {
    const errors: Record<ValidationTypes, boolean> = {} as Record<ValidationTypes, boolean>;
    const typeare = Object.keys(typesAndValues);
    if (typeare.includes('confirmPassword')) {
        if (!typeare.includes('password') || typesAndValues['password'] !== typesAndValues['confirmPassword']) {
            errors['password' as ValidationTypes] = true;
            errors['confrimPassword' as ValidationTypes] = true;
        }
    }
    for (const [type, typeValue] of Object.entries(typesAndValues)) {
        if (type && type in validationTypesFunc) {
            const isValid = validationTypesFunc[type as ValidationTypes](typeValue as string);
            if (!isValid) {
                errors[type as ValidationTypes] = true;
            }
        }
    }

    return Object.keys(errors).length === 0 ? { errors: false } : { errors };
};

const generatePassword = (hard: boolean = true): string => {
    const allowedCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' + (hard ? '!@#$%^&*()a' : 'a');
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += allowedCharacters[Math.floor(Math.random() * 72)];
    }
    return password;
};

export { isValidSingleName, isValidFullName, isValidEmailAddress, isValidPasswordNormal, checkValidation, generatePassword };
