// src/modules/user/user.validator.ts
import { z } from 'zod';

export const createUserValidator = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});