export const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[.\-_/;,])[A-Za-z\d.\-_/;,]{8,20}$/;
    return passwordRegex.test(password);
};