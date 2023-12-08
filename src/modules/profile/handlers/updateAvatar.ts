/** @module types */
import type { Context } from 'koa';
import { PathLike } from 'fs';

/** @module libs */

import { config } from '@/libs/config';
import { isNullOrUndef } from '@/libs/utils/isNullOrUndef';
import { fileTypeFromBuffer } from 'file-type';
import { fileURLToPath } from 'url';
import { prisma } from '@/utils/prismaClient';
import fs from 'fs';
import { promisify } from 'util';

export const updateAvatar = async (ctx: Context): Promise<any> => {
    const folderPath: String = `${config.app.staticPath}/profile/avatar`;

    const { id: userId, email } = ctx.state.decodedToken;
    
    if (ctx.request.files == undefined || ctx.request.files == null) return (ctx.status = 400);

    const avatar = ctx.request.files.avatar;

    const { filepath = '' } = { ...avatar };

    const types = await fileTypeFromBuffer(fs.readFileSync(filepath));

    const write = promisify(fs.copyFile);
    const remove = promisify(fs.rm);
    const dist: PathLike = `${folderPath}/${userId}.${types!.ext}`;

    await write(filepath, dist);

    await remove(filepath);

    const result = await prisma.profile.update({
        where: {
            userId: userId,
        },
        data: {
            avatarPath: dist,
        },
    });

    ctx.status = 200;
    ctx.body = {
        message: `Avatar updated`,
    };
};


// замутить graphql
// Проверить Mimetype На img