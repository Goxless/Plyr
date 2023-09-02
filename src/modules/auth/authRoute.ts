import Router from "koa-router";
import signUpHandler from "./handlers/singUp.js"
import signInHandler from "./handlers/signIn.js";
import logoutHandler from "./handlers/logout.js";


const authRoute = new Router({prefix:"/auth"});

authRoute.post('/singin',signInHandler)
         .post("/signup",signUpHandler)
         .post("/logout",logoutHandler);

export default authRoute.routes();


