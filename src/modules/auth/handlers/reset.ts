import type { Context } from 'koa';

import redisClient from '@/utils/DBClients/redisClient';
import { IReqUserBody } from '@utils/auth/IReqBody';
import prismaClient from '@/utils/DBClients/prismaClient';
import { generateBothTokens, hashPassword } from '@utils/auth/jwtHandler.js';

async function resetHandler(ctx: Context): Promise<any> {
    const linkId = ctx.params.link;

    const user = <IReqUserBody>ctx.request.body;

    const userId = await redisClient.get(linkId);

    if (!userId) ctx.throw(404, 'invalid or expired link');

    const result = await prismaClient.user.update({
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
}

export default resetHandler;
