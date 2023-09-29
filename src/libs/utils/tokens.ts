/** @module npm */
import jwt from 'jsonwebtoken';

/** @module libs */
import config from '@config';
import { payload } from '@/libs/interfaces/JWTpayload';

const {
    jwtAccessSignature,
    jwtRefreshSignature,
    jwtDefaultAccessTTL,
    jwtDefaultRefreshTTL,
} = config;

export const verifyAccessToken = (token: string) => {
    const decoded = jwt.verify(token, jwtAccessSignature);
    return <string>decoded;
};

export const generateTokens = (
    payload: payload,
    accessTokenExpiresIn: string = jwtDefaultAccessTTL,
    refreshTokenExpiresIn: string = jwtDefaultRefreshTTL
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
    expirationTime: string = jwtDefaultRefreshTTL
): string => {
    return jwt.sign(payload, jwtRefreshSignature, { expiresIn: expirationTime });
};

export const generateAccessToken = (
    payload: object,
    expirationTime: string = jwtDefaultAccessTTL
): string => {
    return jwt.sign(payload, jwtAccessSignature, { expiresIn: expirationTime });
};
