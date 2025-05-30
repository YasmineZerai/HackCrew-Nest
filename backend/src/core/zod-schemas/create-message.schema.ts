import { z } from 'zod';

export const CreateMessageSchema = z.object({
  content: z
    .string({
      required_error: 'Content is required',
      invalid_type_error: 'Content must be a string',
    })
    .min(1, 'Content cannot be empty'),

  teamId: z
    .number({
      required_error: 'Team ID is required',
      invalid_type_error: 'Team ID must be a number',
    })
    .positive('Team ID must be positive'),
});

export type CreateMessageDto = z.infer<typeof CreateMessageSchema>;
