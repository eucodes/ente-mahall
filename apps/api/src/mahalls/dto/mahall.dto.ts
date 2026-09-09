import { createMahallSchema } from '@ente-mahall/contracts';
import { createZodDto } from 'nestjs-zod';

export class CreateMahallDto extends createZodDto(createMahallSchema) {}
