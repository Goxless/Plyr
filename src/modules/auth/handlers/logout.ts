/** @module types */
import type { Context } from 'koa';

/** @module libs */
import { redis } from '@/utils/redisClient';
import { prisma } from '@/utils/prismaClient';
import { body } from '@/libs/interfaces/userBody';
import { userExist } from '@/libs/utils/userExist';
import { refreshTokenExists } from '@/libs/utils/refreshExist';

export const logout = async (
    ctx: Context
): Promise<any> => {
    const user = ctx.state.decodedToken;

    await refreshTokenExists(user.id);

    redis.del(user.id);

    ctx.status = 200;
    ctx.body = {
        message: `logged out`,
    };
};
