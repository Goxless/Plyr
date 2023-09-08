import Router from "koa-router";
import authRoute  from "./auth/authRoute.js"


const mainRoute = new Router({prefix:"/v1"});

mainRoute.use(authRoute);

export default mainRoute;
