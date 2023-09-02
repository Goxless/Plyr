import type {Context} from "koa"
import {PrismaClient} from "@prisma/client"

import {IReqUserBody} from "@utils/IReqBody.js"
//import prismaClient from '@utils/prismaClient.js'
import {generateBothTokens,hashPassword} from '../utils/jwtHandler.js';


const prismaClient = new PrismaClient();
// const redis = createClient({
//     host:  ,
//     port: 

// });

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

    console.log(createdUser);

    const {accessToken,refreshToken} = generateBothTokens({email:user.email,userId: createdUser.id});    

    // TODO: закинуть refresh токен в redis


    ctx.status = 201;
    ctx.body={
        message: `User ${user.name} created`,
        data: {
            tokens:{accessToken,refreshToken},
            user:{
                name: createdUser.name,
                email: createdUser.email,
                userID: createdUser.id,
                createdAt: createdUser.createdAt
            }
        }
    };
}

export default signUpHandler;
