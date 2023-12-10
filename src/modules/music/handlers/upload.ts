/** @module type */
import type { Context } from 'koa';

/** @module npm */
import { createHash } from 'crypto';
import * as mm from 'music-metadata';

/** @module libs */
import { prisma } from '@/utils/prismaClient';
import { generateResponse } from '@/libs/utils/generateResponse';
import { uploadFile } from '@/libs/fs/uploadFile';
import { HttpError } from '@/utils/httpError';
import { config } from '@/libs/config';

export const upload = async (
    ctx: Context
): Promise<any> => {
    const { name } = ctx.state.decodedToken;

    const { track } = ctx.request.files!;

    const { filepath = '' } = { ...track };

    const { dist, buffer } = await uploadFile(
        ctx,
        filepath,
        `${config.app.staticPath}${config.music.tracksPath}/`
    );

    const { common, format } = await mm.parseFile(dist);

    const hash = createHash('sha256')
        .update(buffer.toString())
        .digest('hex');

    if (
        await prisma.track.findFirst({
            where: {
                hash: hash,
            },
        })
    ) {
        throw new HttpError(
            'Track is not uploaded ',
            400,
            'Similar track already exists'
        );
    }
    const result = await prisma.track.create({
        data: {
            title: <string>common.title,
            author: name,
            length: <number>format.duration,
            rootPath: dist,
            hash: hash,
        },
        select: {
            id: true,
            title: true,
            author: true,
            artist: true,
            length: true,
        },
    });

    generateResponse(ctx, {
        status: 200,
        body: { message: 'Track uploaded', data: result },
    });
};
