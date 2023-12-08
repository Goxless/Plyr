import { z } from 'zod';
import * as mm from 'music-metadata';
import { config } from '@/libs/config';
import { isNullOrUndef } from '@/libs/utils/isNullOrUndef';
import { HttpError } from '@/utils/httpError';
import { fromZodError } from 'zod-validation-error';

export const TrackFileSchema = z.object({
    track: z
        .any()
        .superRefine((file, ctx) => {
            if (isNullOrUndef(file)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'File is required',
                    fatal: true,
                });

                return z.NEVER;
            }
        })
        .refine(
            (file) => file?.size < config.music.maxSize,
            `Max size of file is ${
                config.music.maxSize / 1024 / 1024
            }mb.`
        )
        .refine(
            (file) => {
                return checkFileIsAudio(file.mimetype);
            },
            ({ mimetype }) => ({
                message: `${mimetype} type is not acceptable`,
            })
        )
});

const checkFileIsAudio = (type: string) => {
    let [extension, MMtype] = type.split('/');
    if (
        extension == 'audio' &&
        config.music.types.includes(MMtype)
    )
        return true;
    else return false;
};

export type TrackFileSchema = z.infer<
    typeof TrackFileSchema
>;
