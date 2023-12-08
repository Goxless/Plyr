/** @module npm */
import jwt from 'jsonwebtoken';

/** @module libs */
import { config } from '@config';
import { payload } from '@/libs/interfaces/JWTpayload';

const { jwt: jwtConfig } = config;

export const verifyAccessToken = (token: string) => {
    const decoded = jwt.verify(token, jwtConfig.accessSignature);
    return decoded;
};
export const verifyRefreshToken = (token: string) => {
    const decoded = jwt.verify(token, jwtConfig.refreshSignature);
    return decoded;
};

export const generateTokens = (
    payload: payload,
    accessTokenExpiresIn: string = jwtConfig.defaultAccessTTL,
    refreshTokenExpiresIn: string = jwtConfig.defaultRefreshTTL
): {
    accessToken: string;
    refreshToken: string;
    accessExpiration: string;
    refreshExpiration: string;
} => {
    return {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
        accessExpiration: accessTokenExpiresIn,
        refreshExpiration: refreshTokenExpiresIn,
    };
};

export const generateRefreshToken = (
    payload: object,
    expirationTime: string = jwtConfig.defaultRefreshTTL
): string => {
    return jwt.sign(payload, jwtConfig.refreshSignature, { expiresIn: expirationTime });
};

export const generateAccessToken = (
    payload: object,
    expirationTime: string = jwtConfig.defaultAccessTTL
): string => {
    return jwt.sign(payload, jwtConfig.accessSignature, { expiresIn: expirationTime });
};
