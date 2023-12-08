/** @module types */
import type { Context } from 'koa';
import { PathLike } from 'fs';
import { IDschema } from '@/libs/zod';
import { User } from '@prisma/client';

/** @module npm */
import fs from 'fs';
import { fileTypeFromBuffer } from 'file-type';
import { promisify } from 'util';

/** @module libs */
import { config } from '@/libs/config';
import { prisma } from '@/utils/prismaClient';
import { HttpError } from '@/utils/httpError';

export const cover = async (ctx: Context): Promise<any> => {
    const folderPath: String =
        config.app.staticPath + config.music.path;

    const { id: playlistId } = <IDschema>ctx.params;
    const { id: userId } = <User>ctx.state.decodedToken;

    if (
        ctx.request.files == undefined ||
        ctx.request.files == null
    )
        throw new HttpError('no files to upload', 400);

    const avatar = ctx.request.files.avatar;

    const { filepath = '' } = { ...avatar };

    const types = await fileTypeFromBuffer(
        fs.readFileSync(filepath)
    );

    const write = promisify(fs.copyFile);
    const remove = promisify(fs.rm);
    const dist: PathLike = `${folderPath}/${userId}.${
        types!.ext
    }`;

    await write(filepath, dist);

    await remove(filepath);

    await prisma.playlist.update({
        where: {
            id: playlistId,
        },
        data: {
            coverPath: dist,
        },
    });

    ctx.status = 200;
    ctx.body = {
        message: `Cover updated`,
    };
};
