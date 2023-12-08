import { Prisma, User } from '@prisma/client';
import { prisma } from '@/utils/prismaClient';
import { HttpError } from '@/utils/httpError';

export const checkForExistance = async (
    table: string,
    field: string,
    uniqueValue: string
): Promise<any> => {
    try {
        const query = Prisma.sql`SELECT * FROM "${Prisma.raw(
            table
        )}" 
        WHERE "${Prisma.raw(field)}" = '${Prisma.raw(
            uniqueValue
        )}';`;

        const entity: any[] =
            await prisma.$queryRaw`${query}`;

        if (!entity[0]) {
            return false;
        }

        return entity[0];
    } catch (e: any) {
        throw new HttpError(
            'Something went wrong',
            404,
            e.message
        );
    }
};
