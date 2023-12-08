import { config } from '@/libs/config';
import { isNotNullOrUndef } from '@/libs/utils/isNotNullorUndef';
import { isNullOrUndef } from '@/libs/utils/isNullOrUndef';
import {
    ParticipantsType,
    validationParticipants,
} from '@/libs/zod/handlers/validationParticipants';
import { HttpError } from '@/utils/httpError';
import { Context, Next, Request } from 'koa';
import { AnyZodObject, ZodEffects, ZodError, z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const validateSchema = (
    validators: validationParticipants
) => {
    return async (ctx: Context, next: Next) => {
        for (const partition in validators) {
            const part =
                validators[
                    partition as keyof typeof validators
                ];

            await checkPartition(
                ctx,
                partition,
                part!.schema,
                config.app.carriersPaths.get(partition)
            );
        }
        await next();
    };
};

async function checkPartition(
    ctx: Context,
    partition: string,
    zodObject: z.ZodType<any>,
    additionalPath?: string | null
) {
    let data = ctx[partition];
    let path = ctx[partition];
    if (
        isNotNullOrUndef(additionalPath) &&
        additionalPath != ''
    ) {
        data = ctx[additionalPath!][partition];
        path = ctx[additionalPath!][partition];
    }
    const result = await zodObject.safeParseAsync(data);

    if (!result.success) {
        throw new HttpError(
            'Validation failed',
            400,
            fromZodError(result.error).toString()
        );
    }

    path = result.data;
}
