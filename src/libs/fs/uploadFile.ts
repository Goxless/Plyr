/** @module type */
import type { Context } from 'koa';

/** @module npm */
import { PathLike } from 'fs';
import { promisify } from 'util';

import fs from 'fs';

/** @module libs */
import * as mm from 'music-metadata';
import { config } from '@/libs/config';

import { fileTypeFromBuffer } from 'file-type';

export const uploadFile = async (
    ctx: Context,
    filepath: string
): Promise<any> => {
    const buffer = await promisify(fs.readFile)(filepath);
    const types = await fileTypeFromBuffer(buffer);

    const write = promisify(fs.copyFile);
    const remove = promisify(fs.rm);

    const dist: string = `${config.app.staticPath}${
        config.music.tracksPath
    }/${ctx.state.decodedToken.id}.${types!.ext}`;

    await write(filepath, dist);

    await remove(filepath);

    return { dist, buffer };
};
