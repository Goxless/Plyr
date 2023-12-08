import { z } from 'zod';

export const emailSchema = z
    .object({
        email: z.string().email().min(3).max(256),
    })

export type emailSchema = z.infer<typeof emailSchema>;
