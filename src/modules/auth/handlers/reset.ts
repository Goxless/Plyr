/** @module types */
import type { Context } from 'koa';

/** @module libs */
import { redis } from '@/utils/redisClient';
import { prisma } from '@/utils/prismaClient';
import { hashPassword } from '@/libs/utils/password';
import { body } from '@/libs/interfaces/userBody';

export const reset = async (ctx: Context): Promise<any> => {
    const linkId = ctx.params.id;

    console.log(linkId);

    const user = <body>ctx.request.body;

    const userId = await redis.get(linkId);

    const result = await prisma.user.update({
        where: {
            id: userId!,
        },
        data: {
            pass: await hashPassword(user.pass),
        },
    });

    ctx.status = 200;
    ctx.body = {
        message: `Password updated`,
    };
};
