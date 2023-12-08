/** @module type */
import type { Context } from 'koa';
import { IDschema } from '@/libs/zod';

/** @module libs */

import { prisma } from '@/utils/prismaClient';
import { generateResponse } from '@/libs/utils/generateResponse';

export const remove = async (
    ctx: Context
): Promise<any> => {
    const { id: playlistId } = <IDschema>ctx.params;

    await prisma.playlist.delete({
        where: {
            id: playlistId,
        },
    });

    await generateResponse(ctx, {
        status: 200,
        message: 'playlist deleted',
    });
};
