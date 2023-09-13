import type { Context } from 'koa';
import ms from 'ms';

import prismaClient from '@utils/prismaClient';
import redisClient from '@utils/redisClient';
import { IReqUserBody } from '@utils/auth/IReqBody';
import { comparePassword, generateBothTokens } from '@utils/auth/jwtHandler';

async function signInHandler(ctx: Context): Promise<any> {
    const user = <IReqUserBody>ctx.request.body;

    const findedUser = await prismaClient.user.findUnique({
        where: { email: user.email },
    });

    if (!findedUser) ctx.throw(404, "user doesn't exists");

    if (!(await comparePassword(user.pass, findedUser.pass))) {
        ctx.throw(401, 'email or password are incorrect');
    }

    const { accessToken, refreshToken, refreshExpiration } = generateBothTokens({
        email: user.email,
        userId: findedUser.id,
    });

    await redisClient.set(findedUser.id, refreshToken, {
        EX: ms(refreshExpiration) / 1000,
    });

    ctx.status = 201;
    ctx.body = {
        message: 'authenticated',
        data: {
            accessToken,
            refreshToken,
            name: findedUser.name,
            email: findedUser.email,
        },
    };
}

export default signInHandler;
