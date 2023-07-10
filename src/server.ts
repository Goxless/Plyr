import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import 'dotenv/config'

import defaulteRoute from "./routes/defaultRoute"

const app = new Koa();

const PORT = parseInt(process.env.PORT ? process.env.PORT : "") || 7001;

app.use(bodyParser());

app.use(cors( {origin:"*"} ));

app.use(defaulteRoute.routes());

const server = app
    .listen(PORT,async()=>{
        console.log(`server running on port: ${PORT}`)
    })
    .on("error", err => {
        console.error(err);
    })

export default server;