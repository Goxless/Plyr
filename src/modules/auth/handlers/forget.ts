/** @module types */
import type { Context } from 'koa';

/** @module npm */
import { v4 as uuid } from 'uuid';

/** @module libs */
import { redis } from '@/utils/redisClient';
import { prisma } from '@/utils/prismaClient';
import { body } from '@/libs/interfaces/userBody';
import { resetMail } from '@/libs/nodemailer/api/reset';
import { userExist } from '@/libs/utils/userExist';

export const forget = async (
    ctx: Context
): Promise<any> => {
    const { email } = <body>ctx.request.body;

    const userDB = await userExist(true, email);

    const linkId = uuid();

    await redis.set(linkId, userDB.id, {
        EX: 600,
    });

    const link = `http://${process.env.IP}:${process.env.PORT}/v1/auth/reset/${linkId}`;

    await resetMail(email, link);

    ctx.status = 201;
    ctx.body = {
        message: 'Reset link sended to email',
        data: {
            notice: 'Link will be dropped in 10 minutes',
            linkId,
        },
    };
};
