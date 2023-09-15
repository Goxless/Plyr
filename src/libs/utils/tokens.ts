/** @module npm */
import jwt from 'jsonwebtoken';

/** @module custom */
import config from '@config';

const { jwtAccessSignature, jwtRefreshSignature, defaultAccessTTL, defaultRefreshTTL } = config;

export const verifyAccessToken = (token: string) => {
    const decoded = jwt.verify(token, jwtAccessSignature);
    return <string>decoded;
};

export const generateTokens = (
    payload: object,
    accessTokenExpiresIn: string = defaultAccessTTL,
    refreshTokenExpiresIn: string = defaultRefreshTTL
): {
    accessToken: string;
    refreshToken: string;
    accessExpiration: string;
    refreshExpiration: string;
} => {
    return {
        accessToken: jwt.sign(payload, jwtAccessSignature, { expiresIn: accessTokenExpiresIn }),
        refreshToken: jwt.sign(payload, jwtRefreshSignature, { expiresIn: refreshTokenExpiresIn }),
        accessExpiration: accessTokenExpiresIn,
        refreshExpiration: refreshTokenExpiresIn,
    };
};

export const generateRefreshToken = (
    payload: object,
    expirationTime: string = defaultRefreshTTL
): string => {
    return jwt.sign(payload, jwtRefreshSignature, { expiresIn: expirationTime });
};

export const generateAccessToken = (
    payload: object,
    expirationTime: string = defaultAccessTTL
): string => {
    return jwt.sign(payload, jwtAccessSignature, { expiresIn: expirationTime });
};
