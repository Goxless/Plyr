/** @module types */
import type { Context } from 'koa';

/** @module npm */
import { v4 as uuid } from 'uuid';

/** @module libs */
import redisClient from '@/utils/redisClient';
import prismaClient from '@/utils/prismaClient';
import { body } from '@/libs/interfaces/body';
import { resetMail } from '@/libs/nodemailer/api/reset';
import { userExist } from '@/libs/utils/userExist';

export const forget = async (ctx: Context): Promise<any> => {
    const { name, email, pass } = <body>ctx.request.body;

    const userDB = await userExist(false, email);

    const linkId = uuid();

    await redisClient.set(linkId, userDB.id, {
        EX: 600,
    });

    const link = `http://${process.env.IP}:${process.env.PORT}/v1/auth/reset/${linkId}`;

    const result = await resetMail(email, link);

    ctx.status = 201;
    ctx.body = {
        message: 'Reset link sended to email',
        body: {
            notice: 'Link will be droped in 10 minutes',
            linkId,
        },
    };
};
