import { Context,Next } from "koa";
import {verifyAccessToken} from '@utils/auth/jwtHandler.js';

export async function verifyAuthorization(ctx:Context, next:Next): Promise<any>{
    
    if(!ctx.header.authorization)
        ctx.throw(401,"No authorization header or parameter has wrong value")

    const token = ctx.header.authorization.split(' ')[1]
    
    const decoded = verifyAccessToken(token);
    
    ctx.state.decodedToken = decoded;
    
    await next();

}