;import { Context,Next,HttpError} from "koa";

function validateSchema(schema: object){
    return async(ctx: Context, next: (ctx: Context) => Promise<any>) => {

        ctx.check(schema);
        
        const logs: any = await ctx.validationErrors(true); //returns false if everything is fine

        if(!!logs)
            ctx.throw(400, JSON.stringify(logs));
   
        await next(ctx);
    }
    
}

export default validateSchema;
