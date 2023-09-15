/** @module types */
import type { Context } from 'koa';

/** @module libs */
import redisClient from '@/utils/redisClient';
import prismaClient from '@/utils/prismaClient';
import { body } from '@/libs/interfaces/body';

export const logout = async (ctx: Context): Promise<any> => {
    console.log(ctx.state.decodedToken);

    const userFromToken = ctx.state.decodedToken;

    const findedUser = await prismaClient.user.findUnique({
        where: { email: userFromToken.email },
    });

    if (!findedUser) ctx.throw(401, 'no such user');

    const currentRefreshToken = await redisClient.get(findedUser.id);

    if (!currentRefreshToken) ctx.throw(400, 'session expired. Log in again');

    redisClient.del(findedUser.id);

    ctx.status = 201;
    ctx.body = {
        message: `logged out`,
    };
};
