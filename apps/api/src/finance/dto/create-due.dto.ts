import { IsDateString, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateDueDto {
  @IsOptional() @IsString() memberId?: string;
  @IsOptional() @IsString() familyId?: string;
  @IsOptional() @IsString() categoryId?: string;
  @IsOptional() @IsString() @MaxLength(50) period?: string;
  @IsString() @MinLength(1) @MaxLength(255) title!: string;
  @IsNumberString() amount!: string;
  @IsDateString() dueDate!: string;
}
