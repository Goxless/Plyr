/** @module types */
import type { Context } from 'koa';

/** @module libs */

import { prisma } from '@/utils/prismaClient';
import fs from 'fs';

export const getProfile = async (
    ctx: Context
): Promise<any> => {
    const { id: userId, email } = ctx.state.decodedToken;

    const profile = await prisma.profile.findUnique({
        where: { userId: userId },
    });

    if (profile == null)
        throw new Error('there is no such profile');

    ctx.status = 206;

    if (ctx.request.accepts('jpeg')) {
        ctx.body = fs.createReadStream(profile.avatarPath);
        ctx.response.attachment(profile.avatarPath);
        return;
    }

    ctx.body = {
        message: 'Profile found',
        data: { ...profile },
    };
};
