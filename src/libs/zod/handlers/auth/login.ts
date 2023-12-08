import { z } from 'zod';
import { emailSchema } from './email';
import { userExist } from '@/libs/utils/userExist';

export const loginSchema = z
    .object({
        pass: z.string().min(6).max(256),
    })
    .merge(emailSchema);

export type loginSchema = z.infer<typeof loginSchema>;
