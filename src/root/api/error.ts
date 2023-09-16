/** @module types */
import type { Context, Next } from 'koa';

export const error = async (ctx: Context, next: Next) => {
    try {
        await next();
    } catch (err:any) {
        ctx.status = err.status || 500;
        ctx.body = {
            error: err.message,
        };
    }
};
