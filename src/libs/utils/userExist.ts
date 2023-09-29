/** @module libs */
import { prisma } from '@/utils/prismaClient';
import { HttpError } from '@/utils/httpError';
import { user } from '../interfaces/userType';



export const userExist = async (checkExistence: boolean, email: string): Promise<user> => {
    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (user && checkExistence) throw new HttpError('user already exists', 400);

    if (!user && !checkExistence) throw new HttpError('user doesn`t exists', 400);

    return user!;
};
