import { z } from 'zod';

export const JoinTeamSchema = z.object({
  code: z.string().length(6, 'Team code must be exactly 6 characters'),
});

export type JoinTeamDto = z.infer<typeof JoinTeamSchema>;
