import type {Context} from "koa"

import {PrismaClient} from "@prisma/client"
//import prismaClient from '@utils/prismaClient.js'
import {IReqUserBody} from "@utils/IReqBody.js"
import {comparePassword, generateBothTokens} from '../utils/jwtHandler.js';

const prismaClient = new PrismaClient();

async function signInHandler(ctx: Context): Promise<any> {
    
    const user = <IReqUserBody>ctx.request.body;
    
    const findedUser = await prismaClient.user.findUnique({
        where: {email:user.email}
    });

    if(!findedUser){
        ctx.throw(400,"user doesn't exists")
    }
 
    if(!await comparePassword(user.pass,findedUser.pass)){
        ctx.throw(401,"email or password are incorrect")
    }


    const {accessToken,refreshToken} = generateBothTokens({email:user.email,userId: findedUser.id});    
     
    ctx.status = 201;
    ctx.body={
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

export default signInHandler;