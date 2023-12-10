/** @module type */
import type { Context } from 'koa';
import { TrackList } from '@/libs/zod/handlers/playlist/trackList';
import { IDschema } from '@/libs/zod';

/** @module libs */
import { prisma } from '@/utils/prismaClient';
import { orStatement } from '../utils/orStatementById';

export const detach = async (
    ctx: Context
): Promise<any> => {
    const { tracks } = <TrackList>ctx.request.body;

    const { id: playlistId } = <IDschema>ctx.params;

    const trackIDs = orStatement(tracks);

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
                disconnect: trackIDs,
            },
            length: {
                decrement: trackLength._sum
                    .length as number,
            },
        },
    });

    ctx.status = 200;
    ctx.body = {
        message: 'playlist updated',
    };
};
