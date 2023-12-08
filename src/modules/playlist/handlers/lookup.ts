/** @module type */
import type { Context } from 'koa';
import { IDschema } from '@/libs/zod';

/** @module libs */
import { prisma } from '@/utils/prismaClient';
import { generateResponse } from '@/libs/utils/generateResponse';

export const lookup = async (
    ctx: Context
): Promise<any> => {
    const { id: playlistId } = <IDschema>ctx.params;

    const playlist = await prisma.playlist.findUnique({
        where: {
            id: playlistId,
        },
        select: {
            id: true,
            title: true,
            author: true,
            length: true,
            track: {
                select: {
                    id: true,
                    title: true,
                    author: true,
                    artist: true,
                    length: true,
                },
            },
        },
    });

    await generateResponse(ctx, {
        status: 200,
        body: {
            message: 'playlist found',
            data: { playlist },
        },
    });
};
