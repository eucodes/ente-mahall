import { createPlanSchema } from '@ente-mahall/contracts';
import { createZodDto } from 'nestjs-zod';

export class CreatePlanDto extends createZodDto(createPlanSchema) {}
