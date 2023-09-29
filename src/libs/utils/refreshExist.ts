/** @module libs */
import { redis } from '@/utils/redisClient';
import { payload } from '@/libs/interfaces/JWTpayload';
import { HttpError } from '@/utils/httpError';

export const refreshExist = async (key: string): Promise<any> => {
    const currentRefreshToken = await redis.exists(key);

    if (!currentRefreshToken) throw new HttpError('session expired. Log in again', 400);

    return currentRefreshToken;
};
