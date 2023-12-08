/** @module types */
import { HttpError } from '@/utils/httpError';
import type { Context } from 'koa';

export const replaceFilesRoute = async (): Promise<any> => {
    return async (
        ctx: Context,
        next: (ctx: Context) => Promise<any>
    ) => {
        ctx.files = ctx.request?.files;
        await next(ctx);
    };
};
