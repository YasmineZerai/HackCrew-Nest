import { z } from 'zod';

export const ChatMessageSchema = z.object({
  content: z.string().min(1),
  teamId: z.number(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
