/** @module npm */
import Router from 'koa-router';
import { auth } from './auth';
import { profile } from './profile';
import { music } from './music';
import { playlist } from './playlist';

export const connector = () => {
    const router = new Router();

    const modules = [music(), auth(), profile(), playlist()];

    return router.use(...modules).routes();
};
