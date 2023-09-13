import { Context, Next } from 'koa';

export default async (ctx: Context, next: Next): Promise<any> => {
    try {
        await next();
    } catch (err: any) {
        ctx.status = err.status || 500;

        ctx.body = {
            message: err.message,
        };
    }
};
