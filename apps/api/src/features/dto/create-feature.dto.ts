import { IsBoolean, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class CreateFeatureDto {
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-z0-9-]+$/, { message: "key must be lowercase letters, numbers, and hyphens only" })
  key!: string;

  @IsString()
  @MaxLength(200)
  name!: string;

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
