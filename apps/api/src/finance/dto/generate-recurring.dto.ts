import { IsDateString, IsOptional, IsString } from "class-validator";

export class GenerateRecurringCollectionsDto {
  @IsString()
  categoryId!: string;

  @IsString()
  period!: string; // e.g., "2026-09" or "Q3-2026" or "2026"

  @IsDateString()
  dueDate!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
