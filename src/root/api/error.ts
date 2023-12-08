/** @module types */
import type { Context, Next } from 'koa';

export const error = async (ctx: Context, next: Next) => {
    try {
        await next();
    } catch (err: any) {

        let body: any = {
            error: err.message,
        };
        if (err.details) body.details = err.details;

        ctx.body = body;
        ctx.status = err.status || 400;
    }
};
