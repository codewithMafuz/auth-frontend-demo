const setToken = (token: string): void => {
    localStorage.setItem('token', JSON.stringify(token));
};

const getToken = (): string | null => {
    const token = localStorage.getItem('token')
    if (isTokenStyleString(token)) {
        return JSON.parse(token)
    } else {
        localStorage.removeItem('token')
        return null
    }
};

const isTokenStyleString = (token: any): boolean => {
    return (token && typeof (token) === 'string' && token !== 'undefined' && token.length > 10 && (token.split('.')).length > 1) ? true : false
}


export { setToken, getToken, isTokenStyleString };
