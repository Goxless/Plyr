import { z } from 'zod';

export const IDschema = z.object({
    id: z.string().uuid('ID must be UUID type'),
});

export type IDschema = z.infer<typeof IDschema>;
