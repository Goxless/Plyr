/** @module npm */
import Router from 'koa-router';

/** @module handlers */
import {
    signUp,
    signIn,
    logout,
    forget,
    reset,
    refresh,
} from './handlers';

/** @module middlewares */
import { verifyAuthorization } from '@/middlewares/auth';
import { verifyRefresh } from '@/middlewares/refresh';
import { validateSchema } from '@/middlewares';

/** @module schemas */
import {
    loginSchema,
    signUpSchema,
    emailSchema,
    passSchema,
} from '@/libs/zod';
import { resetSchema } from '@/libs/zod/handlers/auth/reset';

export const auth = () => {
    const router = new Router({ prefix: '/auth' });

    return router
        .post(
            '/signin',
            validateSchema({
                body: {
                    schema: loginSchema,
                },
            }),
            signIn
        )
        .post(
            '/signup',
            validateSchema({
                body: {
                    schema: signUpSchema,
                },
            }),
            signUp
        )
        .post('/logout', verifyAuthorization, logout)
        .post(
            '/forget',
            validateSchema({
                body: {
                    schema: emailSchema,
                },
            }),
            forget
        )
        .post(
            '/reset/:id',
            validateSchema({
                params: {
                    schema: resetSchema,
                },
                body: {
                    schema: passSchema,
                },
            }),
            reset
        )
        .post('/refresh', verifyRefresh, refresh)
        .routes();
};
