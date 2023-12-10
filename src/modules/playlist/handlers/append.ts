/** @module type */
import type { Context } from 'koa';
import { TrackList } from '@/libs/zod/handlers/playlist/trackList';
import { IDschema } from '@/libs/zod';

/** @module libs */
import { prisma } from '@/utils/prismaClient';
import { generateResponse } from '@/libs/utils/generateResponse';

export const append = async (
    ctx: Context
): Promise<any> => {
    const { tracks } = <TrackList>ctx.request.body;

    const { id: playlistId } = <IDschema>ctx.params;

    const trackIDs = tracks.reduce(
        (acc: { id: string }[], el: string) => {
            acc.push({ id: el });
            return acc;
        },
        []
    );
    const trackLength = await prisma.track.aggregate({
        _sum: {
            length: true,
        },
        where: {
            OR: trackIDs,
        },
    });

    await prisma.playlist.update({
        where: {
            id: playlistId,
        },
        data: {
            track: {
                connect: trackIDs,
            },
            length: {
                increment: trackLength._sum.length!,
            },
        },
    });

    generateResponse(ctx, {
        body: {
            message: 'playlist updated',
        },
        status: 200,
    });
};
