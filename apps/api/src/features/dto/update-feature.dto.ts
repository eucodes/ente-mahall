import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateFeatureDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsBoolean()
  isEnabledGlobally?: boolean;
}
