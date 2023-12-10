/** @module type */
import type { Context } from 'koa';
import { IDschema } from '@/libs/zod';
import { User } from '@prisma/client';

/** @module libs */

import { prisma } from '@/utils/prismaClient';
import { generateResponse } from '@/libs/utils/generateResponse';

export const remove = async (
    ctx: Context
): Promise<any> => {
    const { id: playlistId } = <IDschema>ctx.params;
    const { id: userid } = <User>ctx.state.decodedToken;

    await prisma.playlist.delete({
        where: {
            id: playlistId,
            profile: {
                userId: userid,
            },
        },
    });

    await generateResponse(ctx, {
        status: 200,
        body: {
            message: 'playlist removed',
        },
    });
};
