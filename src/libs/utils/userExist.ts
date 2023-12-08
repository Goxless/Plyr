/** @module libs */
import { prisma } from '@/utils/prismaClient';
import { User } from '@prisma/client';
import { HttpError } from '@/utils/httpError';

export const userExist = async (
    shouldExist: boolean,
    email: string
): Promise<User> => {
    const user: any = await prisma.user.findUnique({
        where: { email: email },
        select: {
            id: true,
            email: true,
            name: true,
            pass: true,
        },
    });

    if (user && !shouldExist)
        throw new HttpError('user already exists', 400);

    if (!user && shouldExist)
        throw new HttpError('user doesn`t exists', 404);

    return user!;
};
