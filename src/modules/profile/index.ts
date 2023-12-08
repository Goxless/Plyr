/** @module npm */
import Router from 'koa-router';
import {koaBody} from 'koa-body';


 /** @module middlewares */
 import { verifyAuthorization } from '@/middlewares';

 /** @module handlers */
 import { updateAvatar } from './handlers/updateAvatar';
import { getProfile } from './handlers/getProfile';


export const profile = () => {
    const router = new Router({ prefix: '/profile' });

    router.use(verifyAuthorization);

    return router
        .get('/', getProfile)
        .put('/edit',koaBody({multipart: true}), updateAvatar)
        .routes();
};
