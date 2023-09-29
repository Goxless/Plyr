/** @module libs */
import { PrismaClient } from '@prisma/client';

const options = {};

export const prisma = new PrismaClient(options);
