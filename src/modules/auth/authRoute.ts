import Router from 'koa-router';

import signUpHandler from './handlers/singUp';
import signInHandler from './handlers/signIn';
import logoutHandler from './handlers/logout';

import { verifyAuthorization } from '@middlewares/authMiddleware';
import validateSchema from '@middlewares/validationMiddleware';

import logoutSchema from '@utils/validationSchemas/authModule/logoutSchema';
import signInSchema from '@utils/validationSchemas/authModule/signInSchema';
import signUpSchema from '@utils/validationSchemas/authModule/signUpSchema';

const authRoute = new Router({ prefix: '/auth' });

authRoute
    .post('signin', '/signin', validateSchema(signInSchema), signInHandler)
    .post('signup', '/signup', validateSchema(signUpSchema), signUpHandler)
    .post('logout', '/logout', validateSchema(logoutSchema), verifyAuthorization, logoutHandler);

export default authRoute.routes();
