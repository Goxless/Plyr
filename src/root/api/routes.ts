/** @module npm */
import Router from 'koa-router';

/** @module modules */
import { auth } from '@/modules/auth';

export const routes = () => {
    const router = new Router({
        prefix: '/v1',
    });

    return router.use(auth()).routes();
};
