import Router from "koa-router";

import signUpHandler from "./handlers/singUp.js"
import signInHandler from "./handlers/signIn.js";
import logoutHandler from "./handlers/logout.js";

import { verifyAuthorization } from "@middlewares/authMiddleware.js";
import validateSchema from "@middlewares/validationMiddleware.js"

import logoutSchema from "@utils/validationSchemas/authModule/logoutSchema.js"
import signInSchema from "@utils/validationSchemas/authModule/signInSchema.js";
import signUpSchema from "@utils/validationSchemas/authModule/signUpSchema.js";


const authRoute = new Router({prefix:"/auth"});

authRoute.post("signin",'/signin', validateSchema(signInSchema), signInHandler)
         .post("signup","/signup", validateSchema(signUpSchema), signUpHandler)
         .post("logout","/logout", validateSchema(logoutSchema), verifyAuthorization,logoutHandler);

export default authRoute.routes();


