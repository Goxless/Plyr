import Router from "koa-router";

const router = new Router();

router.get('/v1/',async (ctx)=>{
    try{
        ctx.status = 201;

        ctx.body ={
            result:"oh gee oh boy it's about to be a good breakfast" 
        };
    }
    catch(e){
        console.log(e);
    }

});

export default router