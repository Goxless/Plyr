/** @module types */
import type { Context } from 'koa';

/** @module npm */
import { v4 as uuid } from 'uuid';

/** @module libs */
import redisClient from '@/utils/redisClient';
import prismaClient from '@/utils/prismaClient';
import { body } from '@/libs/interfaces/body';
import { resetMail } from '@/libs/nodemailer/api/reset';

export const forget = async (ctx: Context): Promise<any> => {
    const user = <body>ctx.request.body;

    const findedUser = await prismaClient.user.findUnique({
        where: { email: user.email },
    });

    if (!findedUser) ctx.throw(404, "user doesn't exists");

    const linkId = uuid();

    await redisClient.set(linkId, findedUser.id, {
        EX: 600,
    });

    const link = `http://${process.env.IP}:${process.env.PORT}/v1/auth/reset/${linkId}`;

    const result = await resetMail(user.email, link);

    console.log(result);

    ctx.status = 201;
    ctx.body = {
        message: 'Reset link sended to email',
        body: {
            notice: 'Link will be droped in 10 minutes',
            linkId,
        },
    };
};
