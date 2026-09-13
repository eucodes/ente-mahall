import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ProvisionTenantDto {
  @IsString()
  @MinLength(3)
  @MaxLength(63)
  @Matches(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, {
    message: "Slug may only contain lowercase letters, numbers, and hyphens"
  })
  slug!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  ownerEmail?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{7,15}$/, { message: "Enter a valid phone number" })
  contactPhone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  district?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  place?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  masjidName?: string;
}
