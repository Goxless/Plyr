import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import 'dotenv/config';
import chalk from 'chalk';
import logger from 'koa-logger';
import koaValidator from 'koa-async-validator';
import Router from 'koa-router';
import ms from 'ms';
import redis from 'redis';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_CLIENT_NAME}:${process.env.REDIS_CLIENT_PASS}
            @${process.env.REDIS_URL}:${process.env.REDIS_PORT}`
});
await redisClient.connect();

const prismaClient = new PrismaClient();

const defaultAccessTTL = '2h';
const defaultRefreshTTL = '30d';
const jwtAccessSignature = process.env.JWT_ACCESS_SIGNATURE;
const jwtRefreshSignature = process.env.JWT_REFRESH_SIGNATURE;
/**
    * generates both access and refresh tokens
    * @param payload
    * @param [expiresIn(access) = default TTL parameter]
    * @param [expiresIn(refresh) = default TTL parameter]
    * @returns object including access and refresh tokens
*/
function generateBothTokens(payload, accessTokenExpiresIn = defaultAccessTTL, refreshTokenExpiresIn = defaultRefreshTTL) {
    return {
        accessToken: jwt.sign(payload, jwtAccessSignature, { expiresIn: accessTokenExpiresIn }),
        refreshToken: jwt.sign(payload, jwtRefreshSignature, { expiresIn: refreshTokenExpiresIn }),
        accessExpiration: accessTokenExpiresIn,
        refreshExpiration: refreshTokenExpiresIn
    };
}
/**
    * Synchronously verify given token using a secret or a public key to get a decoded token token - JWT string to verify secretOrPublicKey - Either the secret for HMAC algorithms, or the PEM encoded public key for RSA and ECDSA
    * @param token
    * @returns decoded token or undefined value
*/
function verifyAccessToken(token) {
    const decoded = jwt.verify(token, jwtAccessSignature);
    return decoded;
}
/**
    * hashes password :/
    * @param password
    * @returns promise
*/
function hashPassword(password) {
    return bcrypt.hash(password, 10);
}
/**
    * compares given password with hashed value
    * @param password
    * @param hash
    * @returns promise
*/
function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

async function signUpHandler(ctx) {
    const user = ctx.request.body;
    const findedUser = await prismaClient.user.findUnique({
        where: { email: user.email }
    });
    if (findedUser) {
        ctx.throw(400, "user already exists");
    }
    const createdUser = await prismaClient.user.create({
        data: {
            name: user.name,
            email: user.email,
            pass: await hashPassword(user.pass)
        }
    });
    const { accessToken, refreshToken, refreshExpiration } = generateBothTokens({ email: user.email, userId: createdUser.id });
    await redisClient.set(createdUser.id, refreshToken, {
        EX: ms(refreshExpiration) / 1000
    });
    ctx.status = 201;
    ctx.body = {
        message: `User ${user.name} created`,
        data: {
            tokens: { accessToken, refreshToken },
            user: {
                name: createdUser.name,
                email: createdUser.email,
                createdAt: createdUser.createdAt
            }
        }
    };
}

async function signInHandler(ctx) {
    const user = ctx.request.body;
    const findedUser = await prismaClient.user.findUnique({
        where: { email: user.email }
    });
    if (!findedUser)
        ctx.throw(404, "user doesn't exists");
    if (!await comparePassword(user.pass, findedUser.pass)) {
        ctx.throw(401, "email or password are incorrect");
    }
    const { accessToken, refreshToken, refreshExpiration } = generateBothTokens({ email: user.email, userId: findedUser.id });
    await redisClient.set(findedUser.id, refreshToken, {
        EX: ms(refreshExpiration) / 1000
    });
    ctx.status = 201;
    ctx.body = {
        message: 'authenticated',
        data: {
            accessToken,
            refreshToken,
            name: findedUser.name,
            email: findedUser.email,
        }
    };
}

async function logoutHandler(ctx) {
    const userFromToken = ctx.state.decodedToken;
    const findedUser = await prismaClient.user.findUnique({
        where: { email: userFromToken.email }
    });
    if (!findedUser)
        ctx.throw(401, 'no such user');
    const currentRefreshToken = await redisClient.get(findedUser.id);
    if (!currentRefreshToken)
        ctx.throw(400, "session expired. Log in again");
    redisClient.del(findedUser.id);
    ctx.status = 201;
    ctx.body = {
        message: `logged out`
    };
}

async function verifyAuthorization(ctx, next) {
    try {
        ctx.assert(ctx.header.authorization, 401, "No authorization header or parameter has wrong value");
        const token = ctx.header.authorization.split(' ')[1];
        const decoded = verifyAccessToken(token);
        ctx.state.decodedToken = decoded;
        await next();
    }
    catch (err) {
        ctx.throw(401, err.message);
    }
}

function validateSchema(schema) {
    return async (ctx, next) => {
        ctx.check(schema);
        const logs = await ctx.validationErrors(true); //returns false if everything is fine
        if (!!logs)
            ctx.throw(400, JSON.stringify(logs));
        await next(ctx);
    };
}

const logoutSchema = {};

const signInSchema = {
    email: {
        in: 'body',
        notEmpty: true,
        isEmail: {
            errorMessage: 'Invalid Email'
        }
    },
    name: {
        in: 'body',
        notEmpty: true,
        isLength: {
            options: [{ min: 3, max: 20 }],
            errorMessage: 'Name must be between 3 and 20 characters long'
        },
    },
    pass: {
        in: 'body',
        notEmpty: true,
        isLength: {
            options: [{ min: 6, max: 20 }],
            errorMessage: 'Password must be between 6 and 20 characters long'
        },
    }
};

const signUpSchema = {
    email: {
        in: 'body',
        notEmpty: true,
        isEmail: {
            errorMessage: 'Invalid Email'
        }
    },
    name: {
        in: 'body',
        notEmpty: true,
        isLength: {
            options: [{ min: 3, max: 20 }],
            errorMessage: 'Name must be between 3 and 20 characters long'
        },
    },
    pass: {
        in: 'body',
        notEmpty: true,
        isLength: {
            options: [{ min: 6, max: 20 }],
            errorMessage: 'Password must be between 6 and 20 characters long'
        },
    },
};

const authRoute = new Router({ prefix: "/auth" });
authRoute.post("signin", '/signin', validateSchema(signInSchema), signInHandler)
    .post("signup", "/signup", validateSchema(signUpSchema), signUpHandler)
    .post("logout", "/logout", validateSchema(logoutSchema), verifyAuthorization, logoutHandler);
var authRoute$1 = authRoute.routes();

const mainRoute = new Router({ prefix: "/v1" });
mainRoute.use(authRoute$1);

var errorPicker = async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
            message: err.message
        };
    }
};

const app = new Koa();
const PORT = parseInt(process.env.PORT ? process.env.PORT : "") || 7001;
app.use(cors({ origin: "*" }));
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
    .on("error", err => {
    console.error(chalk.bgRed.black.bold(err));
});

export { server as default };
