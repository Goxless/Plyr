/** @module types */
import type { Context } from 'koa';

/** @module npm */
import ms from 'ms';

/** @module libs */
import redisClient from '@/utils/DBClients/redisClient';
import { hashPassword } from '@/libs/utils';
import { prisma } from '@/utils/DBClients/prismaClient';
import { generateTokens } from '@/utils/auth/jwtHandler.js';

interface Body {
    name: string;
    email: string;
    pass: string;
}

export const signUp = async (ctx: Context) => {
    const { name, email, pass } = <Body>ctx.request.body;

    const findedUser = await prisma.user.findUnique({
        where: { email: email },
    });

    if (findedUser) {
        ctx.throw(400, 'user already exists');
    }

    const password = await hashPassword(pass);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            pass: password,
        },
    });

    const { accessToken, refreshToken, refreshExpiration } = generateTokens({
        email: email,
        userId: user.id,
    });

    await redisClient.set(user.id, refreshToken, {
        EX: ms(refreshExpiration) / 1000,
    });

    ctx.status = 201;

    ctx.body = {
        message: 'User created',
        data: {
            tokens: { accessToken, refreshToken },
            user,
        },
    };
};
