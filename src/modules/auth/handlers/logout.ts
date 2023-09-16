/** @module types */
import type { Context } from 'koa';

/** @module libs */
import redisClient from '@/utils/redisClient';
import prismaClient from '@/utils/prismaClient';
import { body } from '@/libs/interfaces/body';
import { userExist } from '@/libs/utils/userExist';
import { refreshExist } from '@/libs/utils/refreshExist';

export const logout = async (ctx: Context): Promise<any> => {
    const { id, email } = ctx.state.decodedToken;

    const userDB = await userExist(false, email);

    await refreshExist(userDB.id);

    redisClient.del(userDB.id);

    ctx.status = 201;
    ctx.body = {
        message: `logged out`,
    };
};
