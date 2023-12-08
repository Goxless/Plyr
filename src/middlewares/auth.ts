/** @module types */
import type { Context, Next } from 'koa';
import { payload } from '@/libs/interfaces/JWTpayload';

/** @module libs */
import { verifyAccessToken } from '@/libs/utils/tokens';
import { userExist } from '@/libs/utils/userExist';
import { User } from '@prisma/client';
import { refreshTokenExists } from '@/libs/utils/refreshExist';
import { HttpError } from '@/utils/httpError';

export const verifyAuthorization = async (
    ctx: Context,
    next: Next
): Promise<any> => {
    ctx.assert(
        ctx.header.authorization,
        401,
        'No authorization header or parameter has wrong value'
    );

    const token = ctx.header.authorization.split(' ')[1];

    const decoded = verifyAccessToken(token) as payload;

    if (!(await refreshTokenExists(decoded.id)))
        throw new HttpError('User not logged in', 401);

    ctx.state.decodedToken = await userExist(
        true,
        decoded.email
    )

    await next();
};
