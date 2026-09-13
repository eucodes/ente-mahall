import { IsDateString, IsString, MaxLength, MinLength } from "class-validator";

export class CreateFinancialYearDto {
  @IsString() @MinLength(1) @MaxLength(50) name!: string;
  @IsDateString() startDate!: string;
  @IsDateString() endDate!: string;
}
