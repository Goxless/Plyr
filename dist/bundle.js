import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import 'dotenv/config';
import chalk from 'chalk';
import logger from 'koa-logger';
import Router from 'koa-router';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import redis from 'redis';

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
        accessToken: jwt.sign(payload, jwtRefreshSignature, { expiresIn: accessTokenExpiresIn }),
        refreshToken: jwt.sign(payload, jwtAccessSignature, { expiresIn: refreshTokenExpiresIn }),
        accessExpiration: accessTokenExpiresIn,
        refreshExpiration: refreshTokenExpiresIn
    };
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

const prismaClient$1 = new PrismaClient();
// const redis = createClient({
//     host:  ,
//     port: 
// });
async function signUpHandler(ctx) {
    const user = ctx.request.body;
    const findedUser = await prismaClient$1.user.findUnique({
        where: { email: user.email }
    });
    if (findedUser) {
        ctx.throw(400, "user already exists");
    }
    const createdUser = await prismaClient$1.user.create({
        data: {
            name: user.name,
            email: user.email,
            pass: await hashPassword(user.pass)
        }
    });
    console.log(createdUser);
    const { accessToken, refreshToken } = generateBothTokens({ email: user.email, userId: createdUser.id });
    // TODO: закинуть refresh токен в redis
    ctx.status = 201;
    ctx.body = {
        message: `User ${user.name} created`,
        data: {
            tokens: { accessToken, refreshToken },
            user: {
                name: createdUser.name,
                email: createdUser.email,
                userID: createdUser.id,
                createdAt: createdUser.createdAt
            }
        }
    };
}

const prismaClient = new PrismaClient();
async function signInHandler(ctx) {
    const user = ctx.request.body;
    const findedUser = await prismaClient.user.findUnique({
        where: { email: user.email }
    });
    if (!findedUser) {
        ctx.throw(400, "user doesn't exists");
    }
    if (!await comparePassword(user.pass, findedUser.pass)) {
        ctx.throw(401, "email or password are incorrect");
    }
    const { accessToken, refreshToken } = generateBothTokens({ email: user.email, userId: findedUser.id });
    ctx.status = 201;
    ctx.body = {
        message: `authenticated`,
        data: {
            accessToken,
            refreshToken,
            name: findedUser.name,
            email: findedUser.email,
            userID: findedUser.id,
            createdAt: findedUser.createdAt
        }
    };
}

const redisClient = redis.createClient();

// import redis from "redis"
// import "dotenv/config"
//const prismaClient = new PrismaClient();
async function logoutHandler(ctx) {
    try {
        await redisClient.connect();
        await redisClient.set("loggout check", " exists");
        console.log(await redisClient.get("loggout check"));
        // const user = <IReqUserBody>ctx.request.body;
        // //const redisClient = redis.createClient();
        // //await rdsClient.connect();
        // rdsClient;
        // const findedUser = await prismaClient.user.findUnique({
        //     where: {email:user.email}
        // });
        // if(!findedUser){
        //     ctx.throw(400,"user doesn't exists");
        // }
        // const redisUser = await redisClient.get(<string>user.id);
        // if(!redisUser)
        //     ctx.throw(400);
        //await redisClient.set(<string>user.id,"refreshToken",{EX:53453453455435});  
        // const refreshToken = "some token";
        // console.log(await redisClient.set("test","output test"))
        // console.log(await redisClient.get("test"))
        // //if(в redis нет токена -> 400)
        // // delete from redis by user
    }
    catch (e) {
        console.log(e);
        ctx.throw(400);
    }
    ctx.status = 201;
    ctx.body = {
        message: `logged out`
    };
}

const authRoute = new Router({ prefix: "/auth" });
authRoute.post('/singin', signInHandler)
    .post("/signup", signUpHandler)
    .post("/logout", logoutHandler);
var authRoute$1 = authRoute.routes();

const mainRoute = new Router({ prefix: "/v1" });
mainRoute.use(authRoute$1);

const app = new Koa();
const PORT = parseInt(process.env.PORT ? process.env.PORT : "") || 7001;
app.use(cors({ origin: "*" }));
app.use(bodyParser());
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
