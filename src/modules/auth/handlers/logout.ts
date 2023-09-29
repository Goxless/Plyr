/** @module types */
import type { Context } from 'koa';

/** @module libs */
import { redis } from '@/utils/redisClient';
import { prisma } from '@/utils/prismaClient';
import { body } from '@/modules/auth/types/body';
import { userExist } from '@/libs/utils/userExist';
import { refreshExist } from '@/libs/utils/refreshExist';

export const logout = async (ctx: Context): Promise<any> => {
    const { id, email } = ctx.state.decodedToken;

    const user = await userExist(false, email);

    await refreshExist(user.id);

    redis.del(user.id);

    ctx.status = 201;
    ctx.body = {
        message: `logged out`,
    };
};
