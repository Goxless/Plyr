import { NotEmpty } from '@/libs/interfaces/NotEmpty';
import { AnyZodObject, ZodEffects, z } from 'zod';


export type ParticipantsType = {
    schema: z.ZodType<any>;
    additionalPath?: string;
};

type preValidationParticipants= {
    body?: ParticipantsType;
    query?: ParticipantsType;
    params?: ParticipantsType;
    files?: ParticipantsType;
};

export type validationParticipants = NotEmpty<preValidationParticipants>;
