/** @module npm */
import Router from 'koa-router';

/** @module handlers */
import { signUp } from './handlers/signUp';
import { signIn } from './handlers/signIn';
import { logout } from './handlers/logout';
import { forget } from './handlers/forget';
import { reset } from './handlers/reset';
import { refresh } from './handlers/refresh';

/** @module middlewares */
import { verifyAuthorization } from '@/middlewares/auth';

export const auth = () => {
    const router = new Router({ prefix: '/auth' });

    return router
        .post('/signin', signIn)
        .post('/signup', signUp)
        .post('/logout', verifyAuthorization, logout)
        .post('/forget', forget)
        .post('/reset/:link', reset)
        .post('/refresh', verifyAuthorization, refresh)
        .routes();
};