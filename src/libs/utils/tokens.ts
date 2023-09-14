import jwt from 'jsonwebtoken';
export const verifyAccessToken = (token: string) => {
    const decoded = jwt.verify(token, jwtAccessSignature);
    return <string>decoded;
};
