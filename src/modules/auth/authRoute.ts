import Router from "koa-router";

import signUpHandler from "./handlers/singUp.js"
import signInHandler from "./handlers/signIn.js";
import logoutHandler from "./handlers/logout.js";
import { verifyAuthorization } from "src/middlewares/authMiddleware.js";


const authRoute = new Router({prefix:"/auth"});

authRoute.post('/signin',signInHandler)
         .post("/signup",signUpHandler)
         .post("/logout",verifyAuthorization,logoutHandler);
         
export default authRoute.routes();


