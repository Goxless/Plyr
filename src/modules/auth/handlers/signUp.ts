/** @module types */
import type { Context } from 'koa';

/** @module npm */
import ms from 'ms';

/** @module libs */
import redisClient from '@/utils/redisClient';
import { hashPassword } from '@/libs/utils';
import prisma from '@/utils/prismaClient';
import {generateTokens} from "@/libs/utils/tokens"
import {body} from '@/libs/interfaces/body';


export const signUp = async (ctx: Context): Promise<any> => {
    const { name, email, pass } = <body>ctx.request.body;

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
