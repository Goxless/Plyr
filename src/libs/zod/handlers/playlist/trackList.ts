import { z } from 'zod';

export const TrackList = z.object({
    tracks: z.array(z.string().uuid()).max(1),
});

export type TrackList = z.infer<typeof TrackList>;
