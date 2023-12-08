/** @module type */
import type { Context } from 'koa';
import { User } from '@prisma/client';

/** @module npm */
import ms from 'ms';

/** @module libs */
import { redis } from '@/utils/redisClient';
import { checkPassword } from '@/libs/utils/password';
import { generateTokens } from '@/libs/utils/tokens';
import { userExist } from '@/libs/utils/userExist';


export const signIn = async (
    ctx: Context
): Promise<any> => {
    const { email, pass } = <User>ctx.request.body;

    const user = await userExist(true, email);

    if (!(await checkPassword(pass, user.pass))) {
        ctx.throw(401, 'email or password are incorrect');
    }

    const { accessToken, refreshToken, refreshExpiration } =
        generateTokens({
            id: user.id,
            email,
        });

    await redis.set(user.id, refreshToken, {
        PX: ms(refreshExpiration),
    });

    ctx.status = 200;
    ctx.body = {
        message: 'authenticated',
        data: {
            tokens: { accessToken, refreshToken },
            name: { name: user.name, email: user.email },
        },
    };
};
