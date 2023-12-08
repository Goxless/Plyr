import 'dotenv/config';
/** @module npm */
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import chalk from 'chalk';
import logger from 'koa-logger';
//@ts-ignore
import koaValidator from 'koa-async-validator';

/** @module api */
import { error } from './api/error';
import { routes } from './api/routes';

/** @module config */
import { config } from '@config';

export const server = () => {
    const app = new Koa();

    app.use(cors({ origin: '*' }));

    app.use(bodyParser());

    app.use(error);

    app.use(logger());

    app.use(routes());

    app.listen(config.app.port, async () => {
        console.log(chalk.bold.bgGreenBright(`server running on port: ${config.app.port}`));
    }).on('error', (err) => {
        console.error(chalk.bgRed.black.bold(err));
    });
};
