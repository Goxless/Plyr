/** @module npm */
import Router from 'koa-router';

/** @module handlers */
import signUpHandler from './handlers/singUp';
import signInHandler from './handlers/signIn';
import logoutHandler from './handlers/logout';
import forget from './handlers/forget';
import reset from './handlers/reset';

export const auth = () => {
    const router = new Router({ prefix: '/auth' });

    return (
        router
            .post('/signin', signInHandler)
            .post('/signup', signUpHandler)
            .post('/logout', logoutHandler)
            .post('/forget', forget)
            .post('/reset/:link', reset)
            /** */
            .routes()
    );
};
