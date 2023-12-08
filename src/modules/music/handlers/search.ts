/** @module type */
import { type Context } from 'koa';

/** @module libs */
import { prisma } from '@/utils/prismaClient';
import { generateResponse } from '@/libs/utils/generateResponse';
import { generateWhere as generateWhereWithAnd } from '@/libs/prisma/generateObject';
import { HttpError } from '@/utils/httpError';

export const search = async (
    ctx: Context
): Promise<any> => {
    const fields = await prisma.track.fields;
    const params = ctx.query;

    const track = await prisma.track.findMany({
        where: generateWhereWithAnd(
            Object.keys(fields),
            params
        ),
        select: {
            id: true,
            title: true,
            author: true,
            artist: true,
            length: true,
        },
    });

    if (track.length == 0)
        throw new HttpError('No tracks found', 400);

    generateResponse(ctx, {
        body: {
            message: 'Track found',
            data: {
                ...track,
            },
        },
        status: 200,
    });
};
