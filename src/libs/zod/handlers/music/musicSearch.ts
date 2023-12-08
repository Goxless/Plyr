import { z } from 'zod';
import { IDschema } from '../id';
import { atLeastOneExist } from '../../../utils/atLeastOneShouldExist';

export const musicSearch = z
    .object({
        title: z.string().min(1).max(256),
        author: z.string().min(1).max(256),
        artist: z.string().min(1).max(256),
    })
    .merge(IDschema)
    .partial()
    .refine((data) => {
        return atLeastOneExist(Object.keys(data));
    }, `at least one parameter should be passed`);

export type musicSearch = z.infer<typeof musicSearch>;
