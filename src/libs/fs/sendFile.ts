import { Context } from 'koa';
import fs from 'fs';
import { generateResponse } from '../utils/generateResponse';

export const sendFile = async (ctx: Context, rootPath: string) => {
    if (!rootPath) throw new Error('there is no such track');

    const path: string = rootPath;

    const readStream = fs.createReadStream(path);

    ctx.response.attachment(path);
    
    generateResponse(ctx, {
        body: readStream,
        status: 200,
    });
};
