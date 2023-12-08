/** @module types */
import type { Context } from 'koa';

/** @module npm */
import ms from 'ms';

/** @module libs */
import { redis } from '@/utils/redisClient';
import { userExist } from '@/libs/utils/userExist';
import { generateTokens } from '@/libs/utils/tokens';
import { refreshTokenExists } from '@/libs/utils/refreshExist';

export const refresh = async (
    ctx: Context
): Promise<any> => {
    const token = ctx.state.decodedToken;
    const { id, email } = await userExist(
        true,
        token.email
    );

    await refreshTokenExists(id);

    const { accessToken, refreshToken, refreshExpiration } =
        generateTokens({
            email: email,
            id: id,
        });

    await redis.set(id, refreshToken, {
        PX: ms(refreshExpiration),
    });

    ctx.status = 200;
    ctx.body = {
        message: 'refreshed',
        data: {
            tokens: {
                accessToken,
                refreshToken,
            },
        },
    };
};
