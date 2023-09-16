/** @module libs */
import redisClient from '@/utils/redisClient';
import { payload } from '@/libs/interfaces/JWTpayload';
import { httpError } from '@/utils/httpError';

export const refreshExist = async (key: string): Promise<any> => {
    const currentRefreshToken = await redisClient.exists(key);

    if (!currentRefreshToken)
        throw new httpError(400, 'session expired. Log in again');

    return currentRefreshToken
};
