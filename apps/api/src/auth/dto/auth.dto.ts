import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const loginSchema = z.object({
  mahallSlug: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export const superAdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export class LoginDto extends createZodDto(loginSchema) {}
export class SuperAdminLoginDto extends createZodDto(superAdminLoginSchema) {}
export class RefreshDto extends createZodDto(refreshSchema) {}
