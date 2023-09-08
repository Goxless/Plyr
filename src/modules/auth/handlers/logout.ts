import type {Context} from "koa"

import redisClient from "@utils/redisClient.js"
import prismaClient from '@utils/prismaClient.js'
import {IReqUserBody} from "@utils/auth/IReqBody.js"
import {comparePassword, generateBothTokens} from '@utils/auth/jwtHandler.js';


async function logoutHandler(ctx: Context): Promise<any> {

    const userFromToken = ctx.state.decodedToken;

    const findedUser = await prismaClient.user.findUnique({
        where: {email:userFromToken.email}
    });
    
    if(!findedUser)
        ctx.throw(401, 'no such user');
    
    const currentRefreshToken = await redisClient.get(findedUser.id);
    
    if(!currentRefreshToken)
        ctx.throw( 400, "session expired. Log in again");
    
    redisClient.del(findedUser.id);

    ctx.status = 201;
    ctx.body={
        message: `logged out`
    };
}

export default logoutHandler;