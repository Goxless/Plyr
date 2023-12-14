/** @module npm */
import Router from 'koa-router';
import {koaBody} from 'koa-body';

/** @module middlewares */
import { verifyAuthorization } from '@/middlewares';
import { validateSchema } from '@/middlewares/validateSchema';

/** @module handlers */
import {
    lookup,
    create,
    append,
    detach,
    remove,
    add,
    cover,
} from './handlers';

/** @module schemas */
import { validateDB } from '@/middlewares/validateDB';
import {
    IDschema,
    PlaylistSchema,
    TrackList,
} from '@/libs/zod';

export const playlist = () => {
    const router = new Router({ prefix: '/playlist' });

    router.use(verifyAuthorization);

    return router
        .get(
            '/:id',
            validateSchema({
                params: { schema: IDschema },
            }),
            validateDB('Playlist', 'params', 'id', 'id'),
            lookup
        )
        .put(
            '/:id/cover',
            koaBody({ multipart: true }),
            cover
        )
        .post(
            '/create',
            validateSchema({
                body: {
                    schema: PlaylistSchema,
                },
            }),
            create
        )
        .put(
            '/:id/add',
            validateSchema({
                params: { schema: IDschema },
            }),
            validateDB('Playlist', 'params', 'id', 'id'),
            add
        )
        .put(
            '/edit/:id/append',
            validateSchema({
                params: { schema: IDschema },
                body: {
                    schema: TrackList,
                },
            }),
            validateDB('Playlist', 'params', 'id', 'id'),
            append
        )
        .put(
            '/edit/:id/detach',
            validateSchema({
                params: { schema: IDschema },
            }),
            validateDB('Playlist', 'params', 'id', 'id'),
            detach
        )
        .delete(
            '/:id/delete',
            validateSchema({
                params: { schema: IDschema },
            }),
            validateDB('Playlist', 'params', 'id', 'id'),
            remove
        )
        .routes();
};
