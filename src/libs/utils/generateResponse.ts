import { Context } from 'koa';
import { ctxOptions } from '../interfaces/ctxOptions';

export const generateResponse = async (ctx: Context, options: ctxOptions) => {
    Object.keys(options).map((el) => {
        ctx[el] = options[el];
    });
};
