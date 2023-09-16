/** @module types */
import type { Context, Next } from 'koa';

/** @module libs */
import { verifyAccessToken } from '@/libs/utils/tokens';

export const verifyAuthorization = async (ctx: Context, next: Next): Promise<any> => {
    ctx.assert(
        ctx.header.authorization,
        401,
        'No authorization header or parameter has wrong value'
    );

    const token = ctx.header.authorization.split(' ')[1];

    const decoded = verifyAccessToken(token);

    ctx.state.decodedToken = decoded;

    await next();
};
