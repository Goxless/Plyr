import { z } from 'zod';

export const PlaylistSchema = z.object({
    title: z.string().min(2).max(40),
    tracks: z.array(z.string().uuid()).max(20).optional(),
});

export type PlaylistSchema = z.infer<typeof PlaylistSchema>;
