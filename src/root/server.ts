import 'dotenv/config';
/** @module npm */
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import chalk from 'chalk';
import logger from 'koa-logger';

/** @module api */
import { error } from './api/error';
import { routes } from './api/routes';

export const server = () => {
    const app = new Koa();

    app.use(cors({ origin: '*' }));

    app.use(bodyParser());

    app.use(error);

    app.use(logger());

    app.use(routes());

    app.listen(process.env.PORT, async () => {
        console.log(chalk.bold.bgGreenBright(`server running on port: ${process.env.PORT}`));
    }).on('error', (err) => {
        console.error(chalk.bgRed.black.bold(err));
    });
};
