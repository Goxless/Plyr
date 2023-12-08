/** @module types */
import type { Context } from 'koa';
import { User } from '@prisma/client';
import { PlaylistSchema } from '@/libs/zod/handlers/playlist/create';

/** @module libs */
import { config } from '@/libs/config';
import { prisma } from '@/utils/prismaClient';

export const create = async (
    ctx: Context
): Promise<any> => {
    console.log(ctx.request.body);
    const { title, tracks = [] } = <PlaylistSchema>(
        ctx.request.body
    );
    const { name, id } = <User>ctx.state.decodedToken;

    const trackIDs = tracks.reduce(
        (acc: { id: string }[], el: string) => {
            acc.push({ id: el });
            return acc;
        },
        []
    );

    const time = await prisma.track.aggregate({
        _sum: {
            length: true,
        },
        where: {
            OR: trackIDs,
        },
    });

    const playlist = await prisma.playlist.create({
        data: {
            title,
            author: name,
            length: 0,
            coverPath:
                config.app.staticPath +
                config.music.path +
                config.music.placeholder,
            profile: {
                connect: { id },
            },
        },
        select: {
            id: true,
        },
    });

    if (tracks.length) {
        await prisma.playlist.update({
            where: {
                id: playlist.id,
            },
            data: {
                track: {
                    connect: trackIDs,
                },
                length: 0.0 + (time._sum.length as number),
            },
        });
    }

    ctx.status = 201;
    ctx.body = {
        message: 'playlist created',
        data: {
            playlist,
        },
    };
};