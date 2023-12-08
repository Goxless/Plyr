import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '@/utils/prismaClient';
import { checkForExistance } from '@/libs/prisma/checkEntityExistance';
import { Context, Next } from 'koa';
import { HttpError } from '@/utils/httpError';

export const validateDB = (
    table: string,
    partition: string,
    field: string,
    value: string
) => {
    return async (ctx: Context, next: Next) => {
        const tableNames = Prisma.dmmf.datamodel.models.map(
            (model) => model.name
        );

        if (
            !(await checkForExistance(
                table,
                field,
                ctx[partition][value]
            ))
        ) {
            throw new HttpError('Doesnt exist', 400);
        }

        await next();
    };
};
