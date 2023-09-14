import type { Context } from 'koa';
import { v4 as uuid } from 'uuid';

import redisClient from '@/utils/DBClients/redisClient';
import prismaClient from '@/utils/DBClients/prismaClient';
import { IReqUserBody } from '@utils/auth/IReqBody';
import { generateAccessToken } from '@utils/auth/jwtHandler';
import sendEmail from '@utils/auth/transporter';

async function forgetHandler(ctx: Context): Promise<any> {
    const user = <IReqUserBody>ctx.request.body;

    const findedUser = await prismaClient.user.findUnique({
        where: { email: user.email },
    });

    if (!findedUser) ctx.throw(404, "user doesn't exists");

    const linkId = uuid();

    await redisClient.set(linkId, findedUser.id, {
        EX: 600,
    });

    const link = `http://${process.env.IP}:${process.env.PORT}/v1/auth/reset/${linkId}`;

    //const result = await sendEmail(user.email, link);

    ctx.status = 201;
    ctx.body = {
        message: 'Reset link sended to email',
        body: {
            notice: 'Link will be droped in 10 minutes',
            linkId,
        },
    };
}

export default forgetHandler;
