/** @module npm */
import { connector } from '@/modules';
import Router from 'koa-router';

/** @module modules */

export const routes = () => {
    const router = new Router({
        prefix: '/v1',
    });

    return router.use( connector()).routes();
};
