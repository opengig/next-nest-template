import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const otpSchema = emailSchema.extend({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});
