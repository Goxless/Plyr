/** @module libs */
import prisma from '@/utils/prismaClient';
import { payload } from '@/libs/interfaces/JWTpayload';
import { httpError } from '@/utils/httpError';

export const userExist = async (checkExistence: boolean, email: string): Promise<any> => {
    const userDB = await prisma.user.findUnique({
        where: { email: email },
    });

    if (userDB && checkExistence) throw new httpError(400, 'user already exists');

    if (!userDB && !checkExistence) throw new httpError(404, 'user doesn`t exists');

    return userDB;
};
