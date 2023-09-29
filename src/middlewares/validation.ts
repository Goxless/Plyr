/** @module types */
import type { Context } from 'koa';

export const validateSchema = async (schema: object): Promise<any> => {
    return async (ctx: Context, next: (ctx: Context) => Promise<any>) => {
        ctx.check(schema);

        const logs: any = await ctx.validationErrors(true); //returns false if everything is fine

        if (!!logs) ctx.throw(400, JSON.stringify(logs));

        await next(ctx);
    };
};