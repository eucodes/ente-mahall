import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateHouseDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  displayNumber!: string;

  @IsOptional()
  @IsString()
  divisionId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
