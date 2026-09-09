import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createMemberSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().optional(),
  houseNumber: z.string().optional(),
});

export class CreateMemberDto extends createZodDto(createMemberSchema) {}
