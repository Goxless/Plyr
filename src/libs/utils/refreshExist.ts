/** @module libs */
import { redis } from '@/utils/redisClient';
import { payload } from '@/libs/interfaces/JWTpayload';
import { HttpError } from '@/utils/httpError';

export const refreshTokenExists = async (
    userId: string
): Promise<any> => {
    const currentRefreshToken = await redis.exists(userId);

    if (!currentRefreshToken)
        throw new HttpError(
            'session expired. Log in again',
            400
        );

    return currentRefreshToken;
};
