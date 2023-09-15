/** @module types */
import type { Context, Next } from 'koa';

export const error = async (ctx: Context, next: Next) => {
    try {
        await next();
    } catch (err) {
        ctx.body = {
            error: err,
        };
    }
};
