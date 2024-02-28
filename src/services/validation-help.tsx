const isValidSingleName = (name: string): boolean => name.length >= 2;

const isValidFullName = (fullname: string): boolean => [2, 3].includes(fullname.split(' ').length);

const isValidEmailAddress = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPasswordHard = (password: string): boolean => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\!\@\#\$\%\^\&\*\(\)])[a-zA-Z\d.$]{8,32}/.test(password);

const isValidPasswordNormal = (password: string): boolean => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d.$]{8,32}/.test(password);

type ValidationTypes = 'singleName' | 'fullName' | 'email' | 'password' | 'confirmPassword';

const validationTypesFunc: Record<ValidationTypes, (value: string) => boolean> = {
    singleName: isValidSingleName,
    fullName: isValidFullName,
    email: isValidEmailAddress,
    password: isValidPasswordNormal,
    confirmPassword: isValidPasswordNormal,
};

interface CheckValidationParams {
    singleName?: string;
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
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

export { isValidSingleName, isValidFullName, isValidEmailAddress, isValidPasswordNormal, isValidPasswordHard, checkValidation, generatePassword };
