/** @module types */
import type { Context } from 'koa';
import { User } from '@prisma/client';
import { IDschema } from '@/libs/zod';

/** @module libs */
import { generateResponse } from '@/libs/utils/generateResponse';
import { prisma } from '@/utils/prismaClient';

export const add = async (ctx: Context): Promise<any> => {
    const { id: playlistId } = <IDschema>ctx.params;

    const { id: userId } = <User>ctx.state.decodedToken;

    await prisma.profile.update({
        where: {
            userId: userId,
        },
        data: {
            playlist: {
                connect: {
                    id: playlistId,
                },
            },
        },
    });

    await generateResponse(ctx, {
        status: 200,
        body: {
            message: 'playlist added',
        },
    });
};
