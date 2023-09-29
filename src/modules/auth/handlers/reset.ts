/** @module types */
import type { Context } from 'koa';

/** @module libs */
import { redis } from '@/utils/redisClient';
import { prisma } from '@/utils/prismaClient';
import { hashPassword } from '@/libs/utils/password';
import { body } from '@/modules/auth/types/body';

export const reset = async (ctx: Context): Promise<any> => {
    const linkId = ctx.params.link;

    const user = <body>ctx.request.body;

    const userId = await redis.get(linkId);

    if (!userId) ctx.throw(404, 'invalid or expired link');

    const result = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            pass: await hashPassword(user.pass),
        },
    });

    ctx.status = 201;
    ctx.body = {
        message: `Password updated`,
    };
};
