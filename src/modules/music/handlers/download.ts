/** @module type */
import type { Context } from 'koa';
import { IDschema } from '@/libs/zod';

/** @module libs */
import { sendFile } from '@/libs/fs/sendFile';
import { checkForExistance } from '@/libs/prisma/checkEntityExistance';
import { HttpError } from '@/utils/httpError';

export const download = async (
    ctx: Context
): Promise<any> => {
    const { id: trackId } = <IDschema>ctx.query;

    const track = await checkForExistance(
        'Track',
        'id',
        <string>trackId
    );

    if (!track)
        throw new HttpError('There is no such track', 400);

    await sendFile(ctx, track.rootPath as string);
};
