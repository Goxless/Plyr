import type {Context} from "koa"
import ms from "ms"

import {IReqUserBody} from "@utils/auth/IReqBody.js"
import redisClient from "@utils/redisClient.js"
import prismaClient from '@utils/prismaClient.js'
import {generateBothTokens,hashPassword} from '@utils/auth/jwtHandler.js';


async function signUpHandler(ctx: Context): Promise<any> {

    const user = <IReqUserBody>ctx.request.body;

    const findedUser = await prismaClient.user.findUnique({
        where: {email:user.email}
    });
    
    if(findedUser){
        ctx.throw(400,"user already exists");
    }
        
    const createdUser = await prismaClient.user.create({
        data: { 
            name: user.name,
            email: user.email,
            pass: await hashPassword(user.pass)
        }
    });

    const {accessToken,refreshToken,refreshExpiration} = generateBothTokens({email:user.email,userId: createdUser.id});    

    await redisClient.set(createdUser.id, refreshToken,{
        EX: ms(refreshExpiration) / 1000
    });  

    ctx.status = 201;
    ctx.body={
        message: `User ${user.name} created`,
        data: {
            tokens:{accessToken,refreshToken},
            user:{
                name: createdUser.name,
                email: createdUser.email,
                createdAt: createdUser.createdAt
            }
        }
    };
}

export default signUpHandler;
