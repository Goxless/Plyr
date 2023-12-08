import { z } from 'zod';
import { IDschema } from '../id';
import { redis } from '@/utils/redisClient';

export const resetSchema = z
    .object({})
    .merge(IDschema)
    .refine(
        async (data) => {
            return !!(await redis.get(data.id));
        },
        { message: 'invalid or expired reset link' }
    );

export type resetSchema = z.infer<typeof resetSchema>;
