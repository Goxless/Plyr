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
import { Profile } from '@prisma/client';

export const getProfile = async (ctx: Context): Promise<any> => {
    const { id: userId, email } = ctx.state.decodedToken;

    const profile = await prisma.profile.findUnique({
        where: { userId: userId }
    });

    if(profile == null) throw new Error("there is no such profile")

    ctx.status = 206

    if(ctx.request.accepts("jpeg")){
        ctx.body = fs.createReadStream(profile.avatarPath);
        ctx.response.attachment(profile.avatarPath);
        return
    }
    
    // удалить лишние поля из profile

    ctx.body = {
        message:"Profile found",
        data:{...profile}
    };
};

// замутить graphql
