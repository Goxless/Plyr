/** @module type */
import type { Context } from 'koa';

/** @module npm */
import ms from 'ms';

/** @module libs */
import prismaClient from '@/utils/prismaClient';
import redisClient from '@/utils/redisClient';
import {body} from '@/libs/interfaces/body';
import {checkPassword} from "@/libs/utils/password"
import {generateTokens} from "@/libs/utils/tokens"

export const signIn = async (ctx: Context): Promise<any> => {
    const user = <body>ctx.request.body;

    const findedUser = await prismaClient.user.findUnique({
        where: { email: user.email },
    });

    if (!findedUser) ctx.throw(404, "user doesn't exists");

    if (!(await checkPassword(user.pass, findedUser.pass))) {
        ctx.throw(401, 'email or password are incorrect');
    }

    const { accessToken, refreshToken, refreshExpiration } = generateTokens({
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
};
