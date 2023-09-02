import type {Context} from "koa"
import {PrismaClient} from '@prisma/client'

import redisClient from "@utils/redisClient.js"
import {IReqUserBody} from "@utils/IReqBody.js"
import {comparePassword, generateBothTokens} from '../utils/jwtHandler.js';


// import redis from "redis"
// import "dotenv/config"


//const prismaClient = new PrismaClient();

async function logoutHandler(ctx: Context): Promise<any> {
    try{
        await redisClient.connect();
        await redisClient.set("loggout check"," exists");  
        
        console.log(await redisClient.get("loggout check"))
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
    catch(e){
        console.log(e)
        ctx.throw(400);
    }
    
    ctx.status = 201;
    ctx.body={
        message: `logged out`
    };

}

export default logoutHandler;