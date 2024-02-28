const setToken = (token: string): void => {
    localStorage.setItem('token', JSON.stringify(token));
};

const getToken = (): string | null => {
    return JSON.parse(localStorage.getItem('token') || 'null');
};

const removeToken = (): void => localStorage.removeItem('token');

export { setToken, getToken, removeToken };
