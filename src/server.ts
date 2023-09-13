import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import 'dotenv/config';
import chalk from 'chalk';
import logger from 'koa-logger';
//@ts-ignore
import koaValidator from 'koa-async-validator';

import mainRoute from './modules/mainRoute';
import errorPicker from '@utils/errorPicker';

const app = new Koa();

const PORT = parseInt(process.env.PORT ? process.env.PORT : '') || 7001;

app.use(cors({ origin: '*' }));

app.use(bodyParser());

app.use(koaValidator([]));

app.use(errorPicker);

app.use(logger());

app.use(mainRoute.allowedMethods());

app.use(mainRoute.routes());

const server = app
    .listen(PORT, async () => {
        console.log(chalk.bold.bgGreenBright(`server running on port: ${PORT}`));
    })
    .on('error', (err) => {
        console.error(chalk.bgRed.black.bold(err));
    });

export default server;
