/** @module npm */
import Router from 'koa-router';
import { koaBody } from 'koa-body';

/** @module middlewares */
import { verifyAuthorization } from '@/middlewares/auth';
import { validateSchema } from '@/middlewares/validateSchema';

/** @module handlers */
import { download, search, upload } from './handlers';

/** @module schemas */
import {
    IDschema,
    TrackFileSchema,
    musicSearch,
} from '@/libs/zod';

export const music = () => {
    const router = new Router({ prefix: '/music' });

    router.use(verifyAuthorization);

    return router
        .post(
            '/upload',
            koaBody({ multipart: true }),
            validateSchema({
                files: {
                    schema: TrackFileSchema,
                },
            }),
            upload
        )
        .get(
            '/download',
            validateSchema({ query: { schema: IDschema } }),
            download
        )
        .get(
            '/search',
            validateSchema({
                query: { schema: musicSearch },
            }),
            search
        )
        .routes();
};
