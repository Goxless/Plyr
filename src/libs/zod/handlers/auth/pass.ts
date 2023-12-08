import { z } from 'zod';

export const passSchema = z
    .object({
        pass: z.string().min(3).max(256),
    })

export type passSchema = z.infer<typeof passSchema>;
