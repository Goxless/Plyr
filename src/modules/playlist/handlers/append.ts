/** @module type */
import type { Context } from 'koa';
import { TrackList } from '@/libs/zod/handlers/playlist/trackList';
import { IDschema } from '@/libs/zod';

/** @module libs */
import { prisma } from '@/utils/prismaClient';

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

    let totalTime = 0.0;

    const trackLength = await prisma.track.aggregate({
        _sum: {
            length: true,
        },
        where: {
            OR: trackIDs,
        },
    });

    totalTime += trackLength._sum.length as number;

    const currentLength = await prisma.playlist.findUnique({
        where: {
            id: playlistId,
        },
        select: {
            length: true,
        },
    });

    totalTime = currentLength?.length as number;

    await prisma.playlist.update({
        where: {
            id: playlistId,
        },
        data: {
            track: {
                connect: trackIDs,
            },
            length: totalTime,
        },
    });

    ctx.status = 200;
    ctx.body = {
        message: 'playlist updated',
    };
};
