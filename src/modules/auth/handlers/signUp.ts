/** @module types */
import type { Context } from 'koa';

/** @module npm */
import ms from 'ms';

/** @module libs */
import { redis } from '@/utils/redisClient';
import { hashPassword } from '@/libs/utils';
import { prisma } from '@/utils/prismaClient';
import { generateTokens } from '@/libs/utils/tokens';
import { userExist } from '@/libs/utils/userExist';
import { body } from '@/libs/interfaces/userBody';

/** @module config */
import { config } from '@config';

export const signUp = async (ctx: Context): Promise<any> => {
    const { name, email, pass } = <body>ctx.request.body;

    await userExist(false, email);

    const password = await hashPassword(pass);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            pass: password,
            profile: {
                create: {
                    avatarPath: config.app.staticPath + config.profile.avatarPath + config.profile.placeholder,
                },
            },
        },
    });

    const { accessToken, refreshToken, refreshExpiration } = generateTokens({
        id: user.id,
        email: email,
    });

    await redis.set(user.id, refreshToken, {
        PX: ms(refreshExpiration),
    });

    ctx.status = 201;
    ctx.body = {
        message: 'User created',
        data: {
            tokens: { accessToken, refreshToken },
            user: { email: user.email, name: user.name },
        },
    };
};
