import { z } from 'zod';
import { emailSchema } from './email';
import { passSchema } from './pass';

export const signUpSchema = z.object({
    name: z.string().min(2).max(256),
}).merge(emailSchema).merge(passSchema);

export type signUpSchema = z.infer<typeof signUpSchema>;
