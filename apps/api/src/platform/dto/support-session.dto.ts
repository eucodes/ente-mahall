import { IsOptional, IsString, MaxLength } from "class-validator";

export class StartSupportSessionDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
